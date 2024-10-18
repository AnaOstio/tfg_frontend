import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";


interface ValidatedTextFieldProps {
  label?: string;
  id?: string;
  validator: (value: string) => string;
  onChange: (value: string) => void;
  isValid: (isValid: boolean) => void;
}

export const ValidatedTextField: React.FC<ValidatedTextFieldProps> = (props: ValidatedTextFieldProps) => {

  const { t } = useTranslation();

  const [value, setValue] = useState("");
  const [error, setError] = useState<string>("");

  const handleChange = (e: { target: { value: any; }; }) => {
    const newValue = e.target.value;
    const errorMessage = props.validator(newValue);
    setValue(newValue);
    setError(errorMessage);
    props.isValid(!errorMessage);
    props.onChange(newValue);
  };

  return (
    <TextField
      id={props.id}
      variant="outlined"
      fullWidth
      margin="normal"
      label={props.label}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={t(error)}
    />
  );
};