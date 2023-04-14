import { createTheme } from '@mui/material/styles';
// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#9e9e9e"
    }
  },
  typography: {
    fontFamily: [
      "open sans",
      "rasa",
    ].join(","),
    body1: {
      fontWeight: "300"
    }
  }
});

export default theme;
