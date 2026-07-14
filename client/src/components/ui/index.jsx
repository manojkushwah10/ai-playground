import React from 'react';

export const Button = ({ children, onClick, disabled, className = '', type = 'button', icon }) => {
  return (
    <button
      type={type}
      className={`
        flex items-center justify-center gap-2 
        bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500
        text-white font-medium
        px-4 py-3 md:px-6 md:py-3.5 rounded-full
        shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40
        transform hover:-translate-y-0.5 active:translate-y-0
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        disabled:from-slate-700 disabled:to-slate-700
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="icon">{icon}</span>}
      {children}
    </button>
  );
};

export const Input = ({ value, onChange, placeholder, className = '', onKeyDown }) => {
  return (
    <input
      type="text"
      className={`
        w-full
        bg-slate-900/50 backdrop-blur-sm
        border border-slate-700/50 hover:border-slate-600 focus:border-purple-500/50
        text-slate-100 placeholder-slate-400 text-sm md:text-base
        px-4 py-3 md:px-6 md:py-3.5 rounded-full
        focus:outline-none focus:ring-2 focus:ring-purple-500/20
        shadow-inner
        transition-all duration-200
        ${className}
      `}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
    />
  );
};

export const Select = ({ value, onChange, options, className = '' }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`
        bg-slate-800/60 border border-slate-700/50 text-slate-200 
        py-2 px-3 text-sm rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50
        backdrop-blur-sm transition-all
        ${className}
      `}
      style={{ appearance: 'none', WebkitAppearance: 'none' }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-800">
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export const Slider = ({ value, min, max, step, onChange, label }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={onChange}
        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  );
};

export const Toggle = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center cursor-pointer gap-2">
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked} 
          onChange={onChange} 
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-slate-700'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
      </div>
      {label && <span className="text-sm text-slate-300 select-none">{label}</span>}
    </label>
  );
};
