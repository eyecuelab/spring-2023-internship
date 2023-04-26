import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { getUser } from "./services/session.server";
import Background from "~/images/background.png";
import * as React from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ThemeProvider, withEmotionCache } from "@emotion/react";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import ClientStyleContext from "./utils/ClientStyleContext";
import theme from "./utils/theme";

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = React.useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en" style={{ height: "100%" }}>
        <head>
          <meta charSet="utf-8" />
          <Meta />
          <Links />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
          <title>GeTogether</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700&family=Rasa:wght@400&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            backgroundAttachment: "fixed",
            margin: "0",
            padding: "0",
          }}
        >
      {children}
      </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
          <Document>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </Document>
    </ThemeProvider>
  );
}
