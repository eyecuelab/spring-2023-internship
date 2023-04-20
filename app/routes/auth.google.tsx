import { authenticator } from "../services/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import { LoaderArgs } from "@remix-run/node";

export const action = async ({ request }: LoaderArgs) => {
  // initiating authentication using Google Strategy
  // on success --> redirect to dasboard
  // on failure --> back to homepage/login
  return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: "/login",
    failureRedirect: "/login",
  });
};