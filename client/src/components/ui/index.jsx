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
