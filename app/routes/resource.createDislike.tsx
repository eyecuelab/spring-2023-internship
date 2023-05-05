import { ActionArgs } from "@remix-run/node";

import { createDislike, getDislikesByContributionId } from "~/models/likes.server"

export const action = async ({ request }: ActionArgs) => {
  const data = await request.json();
  if (data.hasOwnProperty("contributionId")) {
    return await getDislikesByContributionId(data.contributionId)
  }
  if (data.hasOwnProperty("dislike")) {
    await createDislike({
      dislike: true,
      contributionId: data.dislike.contributionId,
      userId: data.dislike.userId
    })
  }

  return null;
};