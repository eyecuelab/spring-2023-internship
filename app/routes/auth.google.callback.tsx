import { authenticator } from "../services/auth.server";
import { SocialsProvider } from "remix-auth-socials";
import { LoaderArgs } from "@remix-run/node";

export const loader = ({ request }: LoaderArgs) => {
  return authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: "/events",
    failureRedirect: "/",
  });
};