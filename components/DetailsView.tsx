

import React from 'react';
import { Lancamento } from '../types';

interface DetailsViewProps {
  lancamentos: Lancamento[];
  formatCurrency: (value: number) => string;
}

export const DetailsView: React.FC<DetailsViewProps> = ({ lancamentos, formatCurrency }) => {
    
    const sortedLancamentos = [...lancamentos].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return (
        <div className="bg-dark-bg p-4">
            <div className="max-h-80 overflow-y-auto pr-2">
                {sortedLancamentos.length > 0 ? (
                    sortedLancamentos.map(l => (
                        <div key={l.id} className="flex items-center gap-4 py-3 px-2 border-b border-dashed border-dark-line last:border-b-0 text-sm">
                            <div className="w-24 text-dark-muted">{new Date(l.data + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                            <div className="flex-1">
                                <div className="font-semibold text-dark-text">{l.descricao}</div>
                                <div className="text-xs text-dark-muted">{l.origem}</div>
                            </div>
                             <div className={`w-28 text-right font-medium ${l.valor < 0 ? 'text-bad-500' : 'text-ok-500'}`}>
                                {formatCurrency(l.valor)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-dark-muted">Sem lançamentos para esta categoria.</div>
                )}
            </div>
            
            <div className="flex justify-between items-center mt-2 px-2 text-sm font-medium text-dark-muted">
                <span>{sortedLancamentos.length} itens</span>
            </div>
        </div>
    );
};