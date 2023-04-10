import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { deleteEvent, getEvent } from "~/models/events.server"
import { useLoaderData, Form, Link } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";

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

  return json({ event, userId });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.eventId, "eventId not found");

  await deleteEvent({ userId, id: params.eventId });
  return redirect("/events");
}

export default function EventRoute() {
  const data = useLoaderData();
  const dateTime = new Date(data.event.dateTime);
  return (
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
            <button type="submit" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
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

      <hr />
      <Outlet/>
    </div>
  )
}