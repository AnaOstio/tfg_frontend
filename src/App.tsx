
import { useEffect, useState } from 'react';
import LanguageSwitcher from './components/LanguageSelector';
import './i18n';
import Navbar from './components/NavBar';


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
    <div>
      <Navbar />
    </div>
  );
}

export default App;