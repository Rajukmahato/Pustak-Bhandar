import React, { createContext, useState, useContext, useEffect } from 'react';

const defaultTheme = {
  primaryColor: '#6a0dad',
  secondaryColor: '#4a0b77',
  fontFamily: 'Arial',
  fontSize: '16px',
  borderRadius: '4px',
  darkMode: false
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or use default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', JSON.stringify(newTheme));

    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', newTheme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', newTheme.secondaryColor);
    document.documentElement.style.setProperty('--font-family', newTheme.fontFamily);
    document.documentElement.style.setProperty('--font-size', newTheme.fontSize);
    document.documentElement.style.setProperty('--border-radius', newTheme.borderRadius);

    // Handle dark mode
    document.documentElement.setAttribute('data-theme', newTheme.darkMode ? 'dark' : 'light');
  };

  // Apply theme on initial load and when theme changes
  useEffect(() => {
    updateTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, defaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 