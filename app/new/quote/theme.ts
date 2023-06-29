import { Theme, createTheme } from "@mui/material";

export const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#E0E3E7",
            "--TextField-brandBorderHoverColor": "#B2BAC2",
            "--TextField-brandBorderFocusedColor": "red",
            paddingTop: "1rem",
            color: " white",
            "& label.Mui-focused": {
              color: "rgb(var(--icon-button-rgb))",
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            color: "white",
            fontSize: "1.4rem",
            paddingLeft: "1rem",
            "&:before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom: "2px solid rgb(var(--icon-button-rgb))",
            },
          },
        },
      },
    },
  });
