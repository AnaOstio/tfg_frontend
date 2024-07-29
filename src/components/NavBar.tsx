import { useState, useEffect } from 'react';
import Button from './common/Button';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-blackBackground' : 'bg-lightBackground'} text-white`}>
      <nav className="p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Mi Sitio</div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded ${isDarkMode ? 'bg-blackBackground-primaryButton text-black' : 'bg-lightBackground-primaryButton text-white'}`}
        >
          {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </nav>

      <Button isPrimary={true} isDark={isDarkMode}>
        Hola
      </Button>

      <Button isDark={isDarkMode} isPrimary={false}>
        Adiós
      </Button>
    </div>
  );
};

export default Navbar;
