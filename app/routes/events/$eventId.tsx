import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { deleteEvent, getEvent } from "~/models/events.server"
import { useLoaderData, Form, Link } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { createAttendee, getAttendeesByEventId, isAttendee } from "~/models/attendee.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", {status: 404})
  }
  const event = await getEvent(eventId);
  if (!event) {
    throw new Response("Uh Oh! No event found.", {status: 404});
  }
  const attendees = await getAttendeesByEventId(eventId);
  if (!attendees) {
    return json({ event, userId });
  }
  
  return json({ event, userId, attendees });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", {status: 404})
  }
  // invariant(params.eventId, "eventId not found");

  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  if (_action === "delete") {
    await deleteEvent({ userId, id: eventId });
    return redirect("/events");
  }
  if (_action === "create") {
    const attendee = await isAttendee(userId, eventId);
    if (!attendee) {
      await createAttendee({ userId, eventId })
      return redirect(`/events/${params.eventId}`)
    }
    return null
  }
}

export default function EventRoute() {
  const data = useLoaderData();
  const dateTime = new Date(data.event.dateTime);
  return (
    <div>
      <div style={{ display: "inline-flex", width: "110%" }}>
        <div>
          <h1>Event Info</h1>
          <hr/>
          <h3>Event Title:</h3>
          {data.event.title}
          <h3>Description:</h3>
          {data.event.description}
          <h3>Address:</h3>
          {data.event.address}
          <h3>Date and Time:</h3>
          {`${dateTime.toDateString()} - ${dateTime.toLocaleTimeString()}`}
          {data.event.userId === data.userId ? (
            <div>
              <Form method="post">
                <button type="submit" name="_action" value="delete" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
                  Delete
                </button>
              </Form>
              <Link to="updateEvent">
                <button type="submit" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
                  Update
                </button>
              </Link>
            </div>
          ) : (<div></div>)}
        </div>
        <div style={{ marginLeft: "100px"}}>
          <h1>Attendees</h1>
          <hr />
          <Form method="post">
            <button type="submit" name="_action" value="create" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
              RSVP
            </button>
          </Form>
          <ul>
            {data.attendees.map((attendee: any) => (
              <li key={attendee.id}>{attendee.user.email}</li>
            ))}
            <li>guest 1</li>
            <li>guest 2</li>
            <li>guest 3</li>
          </ul>
        </div>
      </div>
      <hr />
      <Outlet/>    
    </div>
  )
}