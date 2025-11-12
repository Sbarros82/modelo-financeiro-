
import { Lancamento } from '../types';

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];
const filiais: ('Matriz' | 'Filial BH' | 'Filial AL')[] = ['Matriz', 'Filial BH', 'Filial AL'];
const categories = {
  receita: ['Receita de Vendas'],
  despesa: ['INSS', 'Empréstimos', 'Estorno de Serviço', 'Salários', 'Fornecedores', 'Impostos', 'Aluguel'],
  ajuste: ['RESULTADO ASOS']
};

const generateRandomDate = (year: number): string => {
  const month = Math.floor(Math.random() * 11) + 1; // Jan to Nov
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const mockLancamentos: Lancamento[] = [];
let idCounter = 1;

years.forEach(year => {
  // Generate Receitas
  for (let i = 0; i < 20; i++) {
    mockLancamentos.push({
      id: `lanc-${idCounter++}`,
      categoria: 'Receita de Vendas',
      data: generateRandomDate(year),
      descricao: `Venda de produtos e serviços #${Math.floor(Math.random() * 1000)}`,
      origem: `Cliente ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      filial: filiais[Math.floor(Math.random() * filiais.length)],
      valor: Math.floor(Math.random() * 25000) + 5000,
    });
  }

  // Generate Despesas
  categories.despesa.forEach(cat => {
    // Make some categories appear less often
    const transactionCount = (cat === 'Empréstimos' || cat === 'Estorno de Serviço') ? 4 : 10;
    for (let i = 0; i < transactionCount; i++) {
      mockLancamentos.push({
        id: `lanc-${idCounter++}`,
        categoria: cat,
        data: generateRandomDate(year),
        descricao: `Pagamento ref. ${cat}`,
        origem: `Fornecedor ${String.fromCharCode(70 + Math.floor(Math.random() * 5))}`,
        filial: filiais[Math.floor(Math.random() * filiais.length)],
        valor: -(Math.floor(Math.random() * 9000) + 1000),
      });
    }
  });

  // Generate Ajustes
  for (let i = 0; i < 3; i++) {
     mockLancamentos.push({
        id: `lanc-${idCounter++}`,
        categoria: 'RESULTADO ASOS',
        data: generateRandomDate(year),
        descricao: 'Ajuste de resultado do sistema',
        origem: 'Sistema Interno',
        filial: 'Matriz',
        valor: -(Math.floor(Math.random() * 300) + 50),
      });
  }
});


export { mockLancamentos };
