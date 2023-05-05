import { ActionArgs } from "@remix-run/node";

import { getContributions } from "~/models/contributions.server";

export const action = async ({ request }: ActionArgs) => {
  const data = await request.json();
  return await getContributions(data.eventId)
};
