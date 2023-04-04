import { Outlet } from "@remix-run/react";

export default function EventsRoute() {
  return (
    <div>
      <h1>Events Route</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}