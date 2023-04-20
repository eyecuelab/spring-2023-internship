import { Authenticator } from "remix-auth";
import invariant from "tiny-invariant";

import { sessionStorage } from "~/services/session.server";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { getUserByEmail, createGoogleUser } from "~/models/user.server";

invariant(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID must be set");
invariant(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET must be set");

// Create an instance of the authenticator
// It will take session storage as an input parameter and creates the user session on successful authentication
export let authenticator = new Authenticator(sessionStorage, { sessionKey: '_session' });

const getCallback = (provider: SocialsProvider) => {
  return `http://localhost:3000/auth/${provider}/callback`
} 

// Configuring Google Strategy
authenticator.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: getCallback(SocialsProvider.GOOGLE)
  },
  async ({ profile }) => {
    // here you would find or create a user in your database
    const existingUser = await getUserByEmail(profile.emails[0].value);
    if (!existingUser) {
      const user = await createGoogleUser(profile.emails[0].value, profile.displayName, profile.photos[0].value);
    }
    return profile;
  }
));