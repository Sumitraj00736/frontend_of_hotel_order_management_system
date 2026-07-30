import React from 'react';

const avatarColors = [
  'bg-orange-100 text-orange-600',
  'bg-blue-100 text-blue-600',
  'bg-emerald-100 text-emerald-600',
  'bg-violet-100 text-violet-600',
  'bg-pink-100 text-pink-600',
  'bg-amber-100 text-amber-600',
];

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

const getColorIndex = (name = '') => name.charCodeAt(0) % avatarColors.length;

const CustomerAvatar = ({ name, size = 'md' }) => {
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={`${sizeClasses[size]} ${avatarColors[getColorIndex(name)]} rounded-xl flex items-center justify-center font-black border border-white shadow-sm shrink-0`}>
      {getInitials(name)}
    </div>
  );
};

export default CustomerAvatar;
