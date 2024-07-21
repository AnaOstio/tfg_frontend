import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => changeLanguage('en')}>
        English
      </Button>
      <Button variant="contained" onClick={() => changeLanguage('es')}>
        Español
      </Button>
    </div>
  );
}

export default LanguageSwitcher;