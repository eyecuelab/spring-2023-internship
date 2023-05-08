import { ActionArgs } from "@remix-run/node";

import { createDislike, createLike, getDislikesByContributionId, getLikesByContributionId } from "~/models/likes.server"

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