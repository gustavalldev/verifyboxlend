import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white focus:ring-cyan-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white focus:ring-white/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    outline: 'border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white focus:ring-cyan-500',
    'gradient-cyan': 'bg-gradient-to-r from-secondary-500 to-primary-600 hover:from-secondary-600 hover:to-primary-700 text-white focus:ring-secondary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    'gradient-emerald': 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    'gradient-orange': 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white focus:ring-orange-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    'modern-outline': 'border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-300 backdrop-blur-sm',
    'glass': 'bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-gray-800 focus:ring-white/50 shadow-lg',
    'current': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg cursor-default ring-2 ring-green-200',
    'premium': 'bg-gradient-to-r from-accent-600 via-purple-600 to-primary-600 hover:from-accent-700 hover:via-purple-700 hover:to-primary-700 text-white focus:ring-accent-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
