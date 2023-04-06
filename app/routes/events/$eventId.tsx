import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getEvent } from "~/models/events.server"
import { useLoaderData } from "@remix-run/react";


export const loader: LoaderFunction = async ({ params }) => {
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", {status: 404})
  }
  console.log("Event Id:" + eventId);
  const event = await getEvent(eventId);
  if (!event) {
    throw new Response("Uh Oh! No event found.", {status: 404});
  }
  return json({ event });
}

export default function EventRoute() {
  const data = useLoaderData();
  return (
    <div>
      <h1>Event Info</h1>
      <hr />
      <h3>Event Title:</h3>
      {data.event.title}
      <h3>Event Description:</h3>
      {data.event.description}
      <h4>1234 Address St. Portland, OR 97211</h4>
      <h4>5/01/23 -- 5:00pm</h4>
      <hr />
      <ul>
        <li>Event Item (Attendee)</li>
        <li>Event Item (Attendee)</li>
        <li>Event Item (Attendee)</li>
      </ul>
    </div>
  )
}