"use client";

// src/components/ThemeInput.tsx
import React, { useState } from 'react';

interface ThemeInputProps {
  onThemeSubmit: (theme: string) => void;
  loading: boolean; // Add loading prop
}

const ThemeInput: React.FC<ThemeInputProps> = ({ onThemeSubmit, loading }) => {
  const [theme, setTheme] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onThemeSubmit(theme);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Enter theme"
        disabled={loading} // Disable input when loading
        className="input-text"
      />
      <button type="submit" disabled={loading} className={`submit-button ${loading ? 'loading' : ''}`}>
        Submit
      </button>
    </form>
  );
};

export default ThemeInput;
