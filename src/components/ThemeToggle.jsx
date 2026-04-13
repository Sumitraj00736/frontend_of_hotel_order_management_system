import React from 'react';
import { Moon } from 'lucide-react';
import { useTheme } from './ThemeContext.jsx';

const ThemeToggle = ({ label = 'Dark Theme' }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="profile-panel-item">
      <span className="sidebar-icon">
        <Moon size={16} />
      </span>
      <span>{label}</span>
      <label className="toggle-switch">
        <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
};

export default ThemeToggle;
