import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";

// Create an instance of the authenticator
// It will take session storage as an input parameter and creates the user session on successful authentication
export const authenticator = new Authenticator(sessionStorage);

// callback function that will be invoked upon successful authentication from social provider
async function handleSocialAuthCallback({ profile }) {
  // create user in your db here
  // profile object contains all the user data like image, displayName, id
  const existingUser = await getUserByEmail(profile.emails[0].value);

  if (existingUser) {
    return createUserSession({
      redirectTo,
      // remember: remember === "on" ? true : false,
      request,
      userId: existingUser.id,
    });
  }

  const user = await createUser(email, password);

  // use remember if we decide to impliment on login 
  // createUserSession() currently sets remember to true by default
  return createUserSession({
    redirectTo,
    // remember: remember === "on" ? true : false,
    request,
    userId: user.id,
  });
  }

  const user = await createUser(email, password);
  return profile;
}

// Configuring Google Strategy
authenticator.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: ["openid email profile"],
    callbackURL: `http://localhost:3000/auth/${SocialsProvider.GOOGLE}/callback`
  },
  handleSocialAuthCallback
));