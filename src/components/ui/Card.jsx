import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-xl transition-all duration-200';
  
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    glass: 'bg-white/80 backdrop-blur-md border border-gray-200',
    elevated: 'bg-white border border-gray-200 shadow-lg hover:shadow-xl',
    interactive: 'bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-indigo-50 cursor-pointer shadow-sm hover:shadow-lg hover:scale-[1.02] hover:border-cyan-200'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`;
  
  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

