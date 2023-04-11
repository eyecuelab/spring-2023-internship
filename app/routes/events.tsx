import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getEventsByUserId } from "~/models/events.server";
import { json } from "@remix-run/node";
import { useUser } from "~/utils";

import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getAttendeesEvents } from "~/models/attendee.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const events = await getEventsByUserId(userId);
  const attendingEvents = await getAttendeesEvents(userId);

  return json({ events, attendingEvents });
}


export default function EventsRoute() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div>
      <header style={{ display: "inline-flex", flexWrap: "wrap" }}>
        <Link to="/events">
          <div style={{ marginLeft: "200px", textDecoration: "none" }}>
            <h1>Get Together</h1>
          </div>
        </Link>
        <div className="user-info" style={{ marginLeft: "200px" }}>
          <span>{`Hi ${user.email}`}</span>
          <form action="/logout" method="post">
            <button type="submit" className="button">
              Logout
            </button>
          </form>
        </div>
      </header>
      <hr />
      <div style={{ display: "inline-flex" }}>
        <div className="events" style={{ width: "30%" }}>
          <Link to="new">+ Create New Event</Link>
          
          <h5>Your Events</h5>
          <ul>
          {data.events.map((event) => (
            <li key={event.id}>
              <Link prefetch="intent" to={event.id}>{event.title}</Link>
            </li>
          ))}
          </ul>

          <h5>Events You're Attending</h5>
          <ul>
            {data.attendingEvents.map((attendee) => (
              <li key={attendee.event.id}>
                <Link prefetch="intent" to={attendee.event.id}>{attendee.event.title}</Link>
              </li>
            ))}
          </ul>

        </div>
        <div style={{ marginLeft: "50px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}