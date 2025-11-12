import React from 'react';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    year: number;
}

const Button: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'brand' }>> = ({ children, className, variant = 'default', ...props }) => {
    const baseClasses = "px-4 py-2 text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg focus:ring-brand-500 transition-colors duration-150 flex items-center justify-center gap-2";
    const variantClasses = variant === 'brand' 
        ? "bg-brand-600 hover:bg-brand-500 text-white border border-transparent"
        : "bg-light-card dark:bg-dark-card border border-light-line dark:border-dark-line text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg/50";
    return (
        <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
            {children}
        </button>
    );
};


export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, year }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Painel financeiro — {year}</h1>
        <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
          Acompanhamento mensal por categoria, com totais anuais e variação mensal.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={toggleTheme}>
          Tema
        </Button>
        <Button onClick={() => alert('Funcionalidade não implementada.')}>
            Exportar CSV
        </Button>
        <Button onClick={() => window.print()} variant="brand">
          Imprimir
        </Button>
      </div>
    </header>
  );
};
