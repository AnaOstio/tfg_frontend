import { useTranslation } from 'react-i18next';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { LENGAUGES_LIST } from '../utils/constants';
import SpainFlag from '../assets/flags/SpainFlag';
import EnglishFlag from '../assets/flags/EnglishFlag';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const handleChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  const renderIcon = (code: string) => {
    switch (code) {
      case 'es':
        return <SpainFlag width="20px" height="20px" style={{ marginRight: '8px' }} />;
      case 'en':
        return <EnglishFlag width="20px" height="20px" style={{ marginRight: '8px' }} />;
      default:
        return null;
    }
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="language-selector-label">{t("languages.title")}</InputLabel>
      <Select
        labelId="language-selector-label"
        id="language-selector"
        value={i18n.language}
        onChange={handleChange}
        label="langauge"
      >
        {LENGAUGES_LIST.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            {renderIcon(language.code)}
            {t(language.label)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;