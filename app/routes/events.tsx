import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getEventsByUserId } from "~/models/events.server";
import { json } from "@remix-run/node";
import { useUser } from "~/utils/utils";

import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getAttendeesEvents } from "~/models/attendee.server";
import Appbar from "~/components/Appbar";


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
      <Appbar />
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