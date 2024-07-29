
import { useEffect, useState } from 'react';
import LanguageSwitcher from './components/LanguageSelector';
import './i18n';


function App() {

  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    let savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  return (
    <div className={`${theme}`}>
      <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
      <LanguageSwitcher />
      <button onClick={toggleTheme} className="p-2 bg-blue-500 text-white mt-4 dark:bg-gray-700">
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
}

export default App;