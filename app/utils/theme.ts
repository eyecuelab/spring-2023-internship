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
      fontWeight: "400",
      fontSize: "13px",
      lineHeight: "170%",
      textTransform: "capitalize",
      // color: "#868686"
    }
  }
});

export default theme;
