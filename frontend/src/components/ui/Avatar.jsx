import React from 'react';

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substr(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`
      ${sizes[size]} 
      bg-ol-brand-100 text-ol-brand-600 
      rounded-full flex items-center justify-center 
      font-medium
      ${className}
    `}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
