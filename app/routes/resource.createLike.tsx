import { ActionArgs } from "@remix-run/node";

import { createLike, getLikesByContributionId } from "~/models/likes.server"

export const action = async ({ request }: ActionArgs) => {
  const data = await request.json();
  if (data.hasOwnProperty("contributionId")) {
    return await getLikesByContributionId(data.contributionId)
  }
  if (data.hasOwnProperty("like")) {
    await createLike({
      like: true,
      contributionId: data.like.contributionId,
      userId: data.like.userId
    })
  }

  return null;
};