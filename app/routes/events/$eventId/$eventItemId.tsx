import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getEventItem, deleteEventItem } from "~/models/eventItems.server";
import { getEvent } from "~/models/events.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { eventItemId } = params;
  if (!eventItemId) {
    throw new Response("Uh Oh! There was no id found.", {status: 404})
  }
  const eventItem = await getEventItem(eventItemId);
  if (!eventItem) {
    throw new Response("Uh Oh! No event item found.", {status: 404});
  }
  return json({ eventItem });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.eventItemId, "event item not found");

  const event =  await prisma.event.findFirst({ where: {} });

  await deleteEventItem({ id: params.eventItemId });
  return redirect(`/events`);
}

export default function EventItem() {
  const data = useLoaderData();

  return (
    <div>
      <h1>Event Item Details</h1>
      <h4>{data.eventItem.name}</h4>
      <p>{data.eventItem.note}</p>
      <Form method="post">
        <button type="submit" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
          Delete
        </button>
      </Form>
      <Link to="/events">Back to Event List</Link>
    </div>
  )
}