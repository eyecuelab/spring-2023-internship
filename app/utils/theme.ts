import { createTheme } from '@mui/material/styles';
// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#9e9e9e",
    },
  },
  typography: {
    fontFamily: ["open sans", "rasa"].join(","),
  },
});

export default theme;
