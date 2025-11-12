

import React, { useState, useMemo } from 'react';
import { CategoriaData } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import { DetailsView } from './DetailsView';

interface FinancialTableProps {
  data: CategoriaData[];
  formatCurrency: (value: number) => string;
  year: number;
}

const TableCell: React.FC<React.PropsWithChildren<{ as?: 'th' | 'td', className?: string, colSpan?: number, scope?: string }>> = ({ children, as: Component = 'td', className, ...props }) => {
    return <Component className={`px-4 py-3 whitespace-nowrap text-sm ${className}`} {...props}>{children}</Component>;
};

export const FinancialTable: React.FC<FinancialTableProps> = ({ data, formatCurrency, year }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const toggleRow = (nome: string) => {
    setExpandedRow(prev => (prev === nome ? null : nome));
  };
  
  const monthlyTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    data.forEach(cat => {
        cat.meses.forEach((val, i) => {
            totals[i] += val;
        });
    });
    return totals;
  }, [data]);
  
  const grandTotal = useMemo(() => data.reduce((acc, cat) => acc + cat.total, 0), [data]);

  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-line dark:border-dark-line rounded-xl overflow-auto shadow-sm">
      <table className="w-full min-w-[1400px] border-collapse">
        <thead className="bg-light-bg/50 dark:bg-dark-bg/50">
          <tr>
            <TableCell as="th" className="text-left sticky left-0 z-20 w-[280px] bg-light-bg dark:bg-dark-bg font-semibold text-light-muted dark:text-dark-muted">Categoria</TableCell>
            {months.map(m => <TableCell as="th" key={m} className="text-right font-semibold text-light-muted dark:text-dark-muted">{m}</TableCell>)}
            <TableCell as="th" className="text-right sticky right-0 z-20 bg-light-bg dark:bg-dark-bg font-semibold text-light-muted dark:text-dark-muted">Total {year}</TableCell>
          </tr>
        </thead>
        <tbody>
          {data.map(cat => {
            const isExpanded = expandedRow === cat.nome;
            const [displayName, chip] = cat.nome.includes(' ASOS') ? cat.nome.split(' ASOS') : [cat.nome, null];
            
            return (
              <React.Fragment key={cat.nome}>
                <tr className={`group hover:bg-light-chip/50 dark:hover:bg-dark-chip/50 cursor-pointer ${isExpanded ? 'bg-brand-600/10' : ''}`} onClick={() => toggleRow(cat.nome)}>
                  <TableCell as="th" scope="row" className={`text-left sticky left-0 z-10 bg-light-card dark:bg-dark-card group-hover:bg-light-chip/50 dark:group-hover:bg-dark-chip/50 font-medium border-b border-light-line dark:border-dark-line ${isExpanded ? 'bg-brand-600/10' : ''}`}>
                    <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUpIcon className="w-4 h-4 text-brand-500"/> : <ChevronDownIcon className="w-4 h-4 text-light-muted dark:text-dark-muted"/>}
                        <span className={isExpanded ? 'text-brand-500 font-semibold' : 'text-light-text dark:text-dark-text'}>{displayName}</span>
                        {chip && <span className="text-[10px] font-bold bg-light-chip dark:bg-dark-chip border border-light-chip-bd dark:border-dark-chip-bd text-light-muted dark:text-dark-muted px-1.5 py-0.5 rounded-full leading-none">ASOS</span>}
                    </div>
                  </TableCell>
                  {cat.meses.map((val, i) => (
                    <TableCell key={i} className={`text-right border-b border-light-line dark:border-dark-line ${val < 0 ? 'text-bad-500' : val > 0 ? 'text-ok-500' : 'text-light-muted dark:text-dark-muted'}`}>
                      {formatCurrency(val)}
                    </TableCell>
                  ))}
                  <TableCell className={`text-right sticky right-0 z-10 bg-light-card dark:bg-dark-card group-hover:bg-light-chip/50 dark:group-hover:bg-dark-chip/50 font-medium border-b border-light-line dark:border-dark-line ${isExpanded ? 'bg-brand-600/10' : ''} ${cat.total < 0 ? 'text-bad-500' : 'text-ok-500'}`}>
                    {formatCurrency(cat.total)}
                  </TableCell>
                </tr>
                {isExpanded && (
                    <tr className="dark:bg-dark-bg">
                        <TableCell colSpan={14} className="p-0 !border-b-0">
                            <DetailsView lancamentos={cat.lancamentos} formatCurrency={formatCurrency} />
                        </TableCell>
                    </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
        <tfoot>
            <tr className="bg-light-bg dark:bg-dark-bg font-bold border-t-2 border-light-line dark:border-dark-line">
                <TableCell as="th" scope="row" className="text-left sticky left-0 z-10 bg-light-bg dark:bg-dark-bg">Total</TableCell>
                {monthlyTotals.map((total, i) => (
                    <TableCell key={i} className={`text-right ${total < 0 ? 'text-bad-500' : 'text-ok-500'}`}>
                        {formatCurrency(total)}
                    </TableCell>
                ))}
                <TableCell className={`text-right sticky right-0 z-10 bg-light-bg dark:bg-dark-bg ${grandTotal < 0 ? 'text-bad-500' : 'text-ok-500'}`}>
                    {formatCurrency(grandTotal)}
                </TableCell>
            </tr>
        </tfoot>
      </table>
    </div>
  );
};