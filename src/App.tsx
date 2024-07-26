
import { useState } from 'react';
import LanguageSwitcher from './components/LanguageSelector';
import { lightTheme, darkTheme } from './theme';
import './i18n';


function App() {

  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div>
      <LanguageSwitcher />
    </div>
  );
}

export default App;