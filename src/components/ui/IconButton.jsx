import React from 'react';

const IconButton = ({ onClick, className = '', children, type = 'button', ...rest }) => {
  return (
    <button type={type} className={`icon-btn ${className}`.trim()} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default IconButton;
