
import LanguageSwitcher from './components/LanguageSwitcher';
import Welcome from './components/Welcome';
import './i18n'; // Importa la configuración de i18next

function App() {
  return (
    <div>
      <LanguageSwitcher />
      <Welcome />
    </div>
  );
}

export default App;