import React, { useEffect, useRef, useState } from 'react';

const CustomDropdown = ({ value, onChange, options, placeholder = 'Select', className = '', disabled = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`cdrop ${className} ${disabled ? 'disabled' : ''}`} ref={ref}>
      <button
        type="button"
        className="cdrop-btn"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className="chevron">▾</span>
      </button>
      {open && (
        <div className="cdrop-menu">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`cdrop-item ${opt.value === value ? 'active' : ''}`}
              onClick={() => {
                onChange({ target: { value: opt.value } });
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
