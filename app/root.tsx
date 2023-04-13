import { LiveReload, Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";
import { ThemeProvider, createTheme } from "@mui/material";

import type { LoaderArgs } from "@remix-run/node";

import { getUser } from "./session.server";
import Background from "~/images/background.png";

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
    ].join(",")
  }
});

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en" style={{ height: "100%" }}>
        <head>
          <meta charSet="utf-8" />
          <title>GeTogether</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&family=Rasa:wght@400&display=swap" rel="stylesheet" />
        </head>
        <body style={{ backgroundImage: `url(${Background})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "right", margin: "0", padding: "0" }}>
          <Outlet />
          <LiveReload />
        </body>
      </html>
    </ThemeProvider>
  );
}

