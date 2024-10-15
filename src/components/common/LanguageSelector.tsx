import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, FormControl, InputLabel, Box, SelectChangeEvent } from '@mui/material';
import { LENGAUGES_LIST } from '../../utils/constants';
import UnknowFlag from '../../assets/flags/UnknowFlag';
import EnglishFlag from '../../assets/flags/EnglishFlag';
import SpainFlag from '../../assets/flags/SpainFlag';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value as string);
  };

  const renderIcon = (code: string) => {
    switch (code) {
      case 'es':
        return <SpainFlag width="20px" height="20px" style={{ marginRight: '8px' }} />;
      case 'en':
        return <EnglishFlag width="20px" height="20px" style={{ marginRight: '8px' }} />;
      default:
        return <UnknowFlag width="20px" height="20px" style={{ marginRight: '8px' }} />;
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
        label="language"
      >
        {LENGAUGES_LIST.map((language: any) => (
          <MenuItem key={language.code} value={language.code}>
            <Box display="flex" alignItems="center">
              {renderIcon(language.code)}
              {t(language.label)}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;