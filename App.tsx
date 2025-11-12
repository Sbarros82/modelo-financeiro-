
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Lancamento, CategoriaData, Kpi } from './types';
import { mockLancamentos } from './services/mockData';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { KpiCard } from './components/KpiCard';
import { FinancialTable } from './components/FinancialTable';
import { CheckIcon } from './components/icons';

const formatCurrency = (value: number): string => {
  if (value === 0) return '0';
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  return value < 0 ? `(${formatted})` : formatted;
};

const processData = (lancamentos: Lancamento[], year: number): CategoriaData[] => {
    const categories: { [key: string]: CategoriaData } = {};

    lancamentos.forEach(l => {
        const lYear = new Date(l.data).getFullYear();
        if(lYear !== year) return;

        if (!categories[l.categoria]) {
            categories[l.categoria] = {
                nome: l.categoria,
                meses: Array(12).fill(0),
                total: 0,
                lancamentos: [],
            };
        }
        const month = new Date(l.data).getMonth();
        categories[l.categoria].meses[month] += l.valor;
        categories[l.categoria].total += l.valor;
        categories[l.categoria].lancamentos.push(l);
    });

    // Special sorting logic for categories
    return Object.values(categories).sort((a, b) => {
        const getOrder = (name: string) => {
            if (name === 'RESULTADO ASOS') return 1;
            if (name === 'Receita de Vendas') return 2;
            if (name.startsWith('Receita')) return 3;
            return 4;
        };

        const orderA = getOrder(a.nome);
        const orderB = getOrder(b.nome);

        if (orderA !== orderB) {
            return orderA - orderB;
        }

        return a.nome.localeCompare(b.nome);
    });
};

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [allLancamentos] = useState<Lancamento[]>(mockLancamentos);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const allFiliais = useMemo(() => ['Matriz', 'Filial BH', 'Filial AL'], []);
  const [selectedFiliais, setSelectedFiliais] = useState<string[]>(allFiliais);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const lancamentos = useMemo(() => {
    return allLancamentos.filter(l => new Date(l.data).getFullYear() === selectedYear);
  }, [allLancamentos, selectedYear]);

  const globallyFilteredLancamentos = useMemo(() => {
    return lancamentos.filter(l => {
        if (selectedFiliais.length < allFiliais.length && !selectedFiliais.includes(l.filial)) {
            return false;
        }
        if (dateRange.start && l.data < dateRange.start) return false;
        if (dateRange.end && l.data > dateRange.end) return false;
        return true;
    });
  }, [lancamentos, selectedFiliais, dateRange, allFiliais.length]);

  const processedData = useMemo(() => processData(globallyFilteredLancamentos, selectedYear), [globallyFilteredLancamentos, selectedYear]);
  
  const filteredData = useMemo(() => {
      if (!categoryFilter) return processedData;
      return processedData.filter(cat => cat.nome.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [processedData, categoryFilter]);

  const kpis = useMemo<Kpi[]>(() => {
    if (!globallyFilteredLancamentos.length) return [];
    
    const resultadoAcumulado = processedData.reduce((acc, cat) => acc + cat.total, 0);
    
    const monthsWithData = [...new Set(globallyFilteredLancamentos.map(l => new Date(l.data).getMonth()))];
    const lastMonth = Math.max(...monthsWithData);
    const prevMonth = Math.max(...monthsWithData.filter(m => m < lastMonth));
    
    let variacaoText = 'Sem dados para comparação';
    if(lastMonth >=0 && prevMonth >=0){
        const totalLastMonth = processedData.reduce((acc, cat) => acc + cat.meses[lastMonth], 0);
        const totalPrevMonth = processedData.reduce((acc, cat) => acc + cat.meses[prevMonth], 0);
        if (totalPrevMonth !== 0) {
            const percentage = ((totalLastMonth - totalPrevMonth) / Math.abs(totalPrevMonth)) * 100;
            variacaoText = `Variação vs mês anterior ${percentage.toFixed(1)}%`;
        }
    }

    const despesas = globallyFilteredLancamentos.filter(l => l.valor < 0);
    const totalDespesas = despesas.reduce((sum, l) => sum + l.valor, 0);
    const despesaMediaMensal = monthsWithData.length > 0 ? totalDespesas / monthsWithData.length : 0;
    
    const expenseCategories = processedData.filter(c => c.total < 0 && c.nome !== 'RESULTADO ASOS');
    const topCategoria = expenseCategories.length > 0
        ? expenseCategories.reduce((max, cat) => Math.abs(cat.total) > Math.abs(max.total) ? cat : max).nome
        : 'N/A';
    
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const period = monthsWithData.length > 0 ? `${monthNames[Math.min(...monthsWithData)]}–${monthNames[Math.max(...monthsWithData)]}` : 'N/A';

    return [
      { label: 'Resultado acumulado', value: formatCurrency(resultadoAcumulado), trend: variacaoText, colorClass: resultadoAcumulado < 0 ? 'text-bad-500' : 'text-ok-500' },
      { label: 'Despesa média mensal', value: formatCurrency(despesaMediaMensal), trend: period, colorClass: 'text-bad-500' },
      { label: 'Top categoria', value: topCategoria, trend: 'Maior impacto no período', colorClass: 'text-light-text dark:text-dark-text' },
      { label: 'Sinalizações', valueComponent: <div className="flex items-center gap-2"><CheckIcon className="w-6 h-6"/> 3</div>, value: '', trend: 'Itens para revisão', colorClass: 'text-light-text dark:text-dark-text' },
    ];
  }, [globallyFilteredLancamentos, processedData]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Header theme={theme} toggleTheme={toggleTheme} year={selectedYear} />
        
        <Toolbar 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            allFiliais={allFiliais}
            selectedFiliais={selectedFiliais}
            onFilialChange={setSelectedFiliais}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
        </div>
        <FinancialTable 
            data={filteredData} 
            formatCurrency={formatCurrency}
            year={selectedYear} 
        />
      </div>
    </div>
  );
}