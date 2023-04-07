import { Link, useLoaderData } from "@remix-run/react";
import { getEventItems } from "~/models/eventItems.server";
import { json } from "@remix-run/node";
import { useUser } from "~/utils";
import { Event } from "~/models/eventItems.server";

import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", {status: 404})
  }
  const eventItemsList = await getEventItems(eventId);
  return json({ eventItemsList });
};

export default function EventItemsList() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div>
      <h1>Event Items</h1>

      <ul>
        {data.eventItemsList.map((item: any) => (
          <li key={item.id}>
            <p>{item.name}: {item.note}</p>
          </li>
        ))}
      </ul>
      <Link to="newEventItem">+ Add Item</Link>
    </div>
  );
}
