import { LiveReload, Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";

import type { LoaderArgs } from "@remix-run/node";

import { getUser } from "./session.server";

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Get-Together</title>
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
