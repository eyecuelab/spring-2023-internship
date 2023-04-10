import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getEventItem, deleteEventItem } from "~/models/eventItems.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params }) => {
  const { eventItemId } = params;

  if (!eventItemId) {
    throw new Response("Uh Oh! There was no id found.", { status: 404 });
  }
  const eventItem = await getEventItem(eventItemId);
  if (!eventItem) {
    throw new Response("Uh Oh! No event item found.", { status: 404 });
  }
  console.log({ eventItem });
  return json({ eventItem });
};

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.eventItemId, "event item not found");

  const eventId = params.eventId;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id found.", { status: 404 });
  }
  await deleteEventItem({ id: params.eventItemId });
  return redirect(`/events/${eventId}`);
}

export default function EventItem() {
  const data = useLoaderData();
  return (
    <div>
      <h1>Event Item Details</h1>
      <h4>{data.eventItem.name}</h4>
      <p>{data.eventItem.note}</p>
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete Item
        </button>
      </Form>
      <Link to={"updateEventItem"}>
        <button
          type="submit"
          className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Update Item
        </button>
      </Link>
      <Link to={`/events/${data.eventItem.eventId}`}>Back to Event List</Link>
      <Outlet/>
    </div>
  );
}
