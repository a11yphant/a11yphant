import PriorityHigh from "@mui/icons-material/PriorityHigh";
import { InputAdornment, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

export interface TextInputProps {
  label: string;
  value?: string;
  type?: HTMLInputElement["type"];
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  error?: boolean;
  inputRef?: React.Ref<any>;
}

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    fontFamily: '"IBM Plex Sans", sans-serif',
    letterSpacing: "0.025em",
    transition: "color border-color border-width",
    transitionDuration: "300ms",
    color: "white",
    "& fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&.Mui-error fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-outlined": {
    color: "white",
  },
  "& .MuiInputLabel-outlined.Mui-focused": {
    color: "white",
  },
  "& .MuiInputLabel-outlined.Mui-error": {
    color: "white",
  },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    color: "white",
    borderColor: "white",

    "& legend span": {
      color: "white",
    },
  },
  "& .MuiInputAdornment-root": {
    color: "white",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "white",
    fontSize: "1rem",
  },
});

const TextInput: React.FC<TextInputProps> = ({ label, value, type, ...props }) => {
  return (
    <StyledTextField
      label={label}
      value={value}
      type={type || "text"}
      variant="outlined"
      InputProps={{
        endAdornment: props.error ? (
          <InputAdornment position="end">
            <PriorityHigh />
          </InputAdornment>
        ) : undefined,
      }}
      {...props}
      fullWidth
    />
  );
};

export default TextInput;
