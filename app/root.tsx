import { LiveReload, Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";

import type { LoaderArgs } from "@remix-run/node";
import { getUser } from "./session.server";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  // Override or create new styles, colors, palettes...
});

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>GeTogether</title>
        </head>
        <body>
          <Outlet />
          <LiveReload />
        </body>
      </html>
    </ThemeProvider>
  );
}
