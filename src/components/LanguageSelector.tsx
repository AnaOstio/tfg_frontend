import { useTranslation } from 'react-i18next';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { LENGAUGES_LIST } from '../utils/constants';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const handleChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
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
            {t(language.label)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;