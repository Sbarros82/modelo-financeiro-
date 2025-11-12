
import React, { useState, useRef, useEffect } from 'react';
import { BuildingOffice2Icon, CalendarDaysIcon, ChevronDownIcon, MagnifyingGlassIcon } from './icons';

interface ToolbarProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  categoryFilter: string;
  onCategoryFilterChange: (filter: string) => void;
  allFiliais: string[];
  selectedFiliais: string[];
  onFilialChange: (filiais: string[]) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

const DateInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input 
        type="text" 
        onFocus={(e) => e.target.type = 'date'} 
        onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
        {...props}
    />
);

export const Toolbar: React.FC<ToolbarProps> = ({ 
    selectedYear, onYearChange, 
    categoryFilter, onCategoryFilterChange,
    allFiliais, selectedFiliais, onFilialChange,
    dateRange, onDateRangeChange
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [filialDropdownOpen, setFilialDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setFilialDropdownOpen(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const handleFilialCheckboxChange = (filial: string, checked: boolean) => {
      const newFiliais = checked 
          ? [...selectedFiliais, filial]
          : selectedFiliais.filter(f => f !== filial);
      onFilialChange(newFiliais);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateRangeChange({ ...dateRange, [e.target.name]: e.target.value });
  };


  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 p-2 rounded-xl border-2 border-brand-500/80 text-sm">
      {/* Período */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-dark-muted">Período</span>
        <select value={selectedYear} onChange={(e) => onYearChange(Number(e.target.value))} className="bg-transparent font-semibold outline-none appearance-none cursor-pointer pr-5 -mr-2 bg-no-repeat" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.1rem center', backgroundSize: '1.2em 1.2em' }}>
          {years.map(year => <option key={year} value={year} className="bg-dark-card text-dark-text">{year}</option>)}
        </select>
      </div>
      
      <div className="w-px h-6 bg-dark-line self-center"></div>

      {/* Buscar */}
      <div className="flex-1 flex items-center gap-2 min-w-[200px]">
        <MagnifyingGlassIcon className="w-5 h-5 text-dark-muted" />
        <input 
          type="text" 
          placeholder="Buscar categoria..." 
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="bg-transparent outline-none w-full font-medium placeholder:text-dark-muted"
        />
      </div>
      
      <div className="w-px h-6 bg-dark-line self-center"></div>

      {/* Filial Filter */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setFilialDropdownOpen(!filialDropdownOpen)} className="flex items-center gap-2 text-left">
            <BuildingOffice2Icon className="w-5 h-5 text-dark-muted" />
            <span className="font-medium text-dark-muted">
                {selectedFiliais.length === allFiliais.length ? 'Todas as Filiais' : `${selectedFiliais.length} Filial(is)`}
            </span>
            <ChevronDownIcon className={`w-4 h-4 text-dark-muted transition-transform ${filialDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {filialDropdownOpen && (
            <div className="absolute top-full mt-2 w-48 bg-dark-card border border-dark-line rounded-lg shadow-lg z-20 p-2">
                {allFiliais.map(filial => (
                    <label key={filial} className="flex items-center gap-2 p-1.5 rounded hover:bg-dark-bg cursor-pointer">
                        <input type="checkbox" checked={selectedFiliais.includes(filial)} onChange={(e) => handleFilialCheckboxChange(filial, e.target.checked)} className="h-4 w-4 rounded bg-dark-bg border-dark-line text-brand-600 focus:ring-brand-500" />
                        <span className="text-dark-text">{filial}</span>
                    </label>
                ))}
            </div>
        )}
      </div>

       {/* Date Filter */}
      <div className="flex items-center gap-2">
        <CalendarDaysIcon className="w-5 h-5 text-dark-muted" />
        <DateInput name="start" value={dateRange.start} onChange={handleDateChange} placeholder="Data Início" className="bg-transparent outline-none w-28 placeholder:text-dark-muted font-medium" />
        <span className="text-dark-muted">→</span>
        <DateInput name="end" value={dateRange.end} onChange={handleDateChange} placeholder="Data Fim" className="bg-transparent outline-none w-28 placeholder:text-dark-muted font-medium" />
      </div>
      
      <div className="flex-grow"></div>

      <div className="w-px h-6 bg-dark-line self-center"></div>

      {/* Métricas */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-dark-muted">Métricas</span>
        <select className="bg-transparent font-semibold outline-none appearance-none cursor-pointer pr-5 -mr-2 bg-no-repeat" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.1rem center', backgroundSize: '1.2em 1.2em' }}>
          <option className="bg-dark-card text-dark-text">Média Mensal</option>
          <option className="bg-dark-card text-dark-text">Variação Mensal</option>
          <option className="bg-dark-card text-dark-text">Acumulado</option>
        </select>
      </div>
    </div>
  );
};