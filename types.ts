export interface Lancamento {
  id: string;
  categoria: string;
  data: string; // YYYY-MM-DD
  descricao: string;
  origem: string;
  filial: 'Matriz' | 'Filial BH' | 'Filial AL';
  valor: number;
}

export interface CategoriaData {
  nome: string;
  subCategoria?: string;
  meses: number[];
  total: number;
  lancamentos: Lancamento[];
}

export interface Kpi {
    label: string;
    value: string;
    valueComponent?: React.ReactNode;
    trend: string;
    colorClass: string;
}
