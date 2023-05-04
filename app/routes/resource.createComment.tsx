import { ActionArgs } from "@remix-run/node";

import { createComment } from "~/models/comments.server"

export const action = async ({ request }: ActionArgs) => {
  const data = await request.json();
  await createComment({
    post: data.payload.post,
    contributionId: data.payload.contributionId,
    userId: data.payload.userId
  })  
  return null;
};