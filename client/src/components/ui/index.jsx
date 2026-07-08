import React from 'react';

export const Button = ({ children, onClick, disabled, className = '', type = 'button', icon }) => {
  return (
    <button
      type={type}
      className={`glass-button ${className}`}
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
      className={`glass-input w-full ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
    />
  );
};
