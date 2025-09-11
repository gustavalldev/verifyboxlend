import React from 'react';
import Card from './Card';

const StatsCard = ({ 
  title, 
  value, 
  icon = null, 
  loading = false,
  className = '',
  onClick = null
}) => {
  const getGradientClass = () => {
    if (className.includes('bg-red-50')) {
      return 'bg-gradient-to-br from-red-500 to-pink-600';
    }
    return 'bg-gradient-to-br from-cyan-400 to-indigo-600';
  };

  const getIconColor = () => {
    if (className.includes('bg-red-50')) {
      return 'text-red-600';
    }
    return 'text-cyan-600';
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      variant="default" 
      className={`p-6 ${className} ${onClick ? 'cursor-pointer group' : ''} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        className.includes('bg-red-50') 
          ? 'hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:border-red-200' 
          : 'hover:bg-gradient-to-r hover:from-cyan-50 hover:to-indigo-50 hover:border-cyan-200'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1 group-hover:text-gray-700 transition-colors duration-300">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>
              ) : (
                typeof value === 'number' ? value.toLocaleString() : value
              )}
            </p>
            {!loading && typeof value === 'number' && (
              <span className="text-sm text-gray-500">
                {value > 0 && '+'}{value > 0 ? '↗' : value < 0 ? '↘' : '→'}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`w-14 h-14 ${getGradientClass()} rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
            <span className="text-white text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{icon}</span>
          </div>
        )}
      </div>
      
      {!loading && typeof value === 'number' && (
        <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
          <div className="flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
            <span>Обновлено</span>
            <span>{new Date().toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
