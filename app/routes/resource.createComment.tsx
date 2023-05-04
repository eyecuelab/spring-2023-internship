import { ActionArgs } from "@remix-run/node";

import { createComment, getCommentsByContributionId } from "~/models/comments.server"

export const action = async ({ request }: ActionArgs) => {
  const data = await request.json();
  if (data.hasOwnProperty("contributionId")) {
    return await getCommentsByContributionId(data.contributionId)
  }
  if (data.hasOwnProperty("payload")) {
    await createComment({
      post: data.payload.post,
      contributionId: data.payload.contributionId,
      userId: data.payload.userId
    })
  }

  return null;
};