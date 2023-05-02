import { useEffect, useRef } from "react";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { GoogleProfile, SocialsProvider } from "remix-auth-socials";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";

import { createUser, getUserByEmail, verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/services/session.server";
import { safeRedirect, validateEmail } from "~/utils/utils";
import { authenticator } from "~/services/auth.server";
import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import BlackLogo from "~/images/black-logo.png";
import GoogleLogo from "~/images/google-logo.png";

export const loader = async ({ request }: LoaderArgs) => {
  const googleUser = (await authenticator.isAuthenticated(
    request
  )) as GoogleProfile;
  if (googleUser) {
    const user = await getUserByEmail(googleUser.emails[0].value);
    if (user) {
      const redirectTo = "/events";
      return createUserSession({
        redirectTo,
        // remember: remember === "on" ? true : false,
        request,
        userId: user.id,
      });
    }
  }

  const userId = await getUserId(request);
  if (userId) return redirect("/events");

  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const loginType = formData.get("loginType");
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  switch (loginType) {
    case "login": {
      const user = await verifyLogin(email, password);

      if (!user) {
        return json(
          { errors: { email: "Invalid email or password", password: null } },
          { status: 400 }
        );
      }

      // use remember if we decide to impliment on login
      // createUserSession() currently sets remember to true by default
      return createUserSession({
        redirectTo,
        // remember: remember === "on" ? true : false,
        request,
        userId: user.id,
      });
    }
    case "register": {
      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        return json(
          {
            errors: {
              email: "A user already exists with this email",
              password: null,
            },
          },
          { status: 400 }
        );
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
  }
};

export default function Login() {
  // vvvvv---original code was throwing type error on actionData.error---vvvvv
  // const actionData = useActionData<typeof action>();
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/events";
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(`ActionData:${actionData}`);
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Box
      style={{
        backgroundColor: "white",
        width: "53%",
        height: "100%",
        position: "absolute",
      }}
    >
      <Box
        data-light=""
        style={{ marginTop: "25%", marginLeft: "15%", marginRight: "22%" }}
      >
        <Link to="/">
          <img src={BlackLogo} style={{ height: "40px" }} alt="Black logo." />
        </Link>
        <Form method="post">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <FormLabel>Login or Register?</FormLabel>
          <RadioGroup defaultValue="login" name="loginType">
            <FormControlLabel
              value="login"
              name="loginType"
              control={<Radio />}
              label="Login"
            />
            <FormControlLabel
              value="register"
              name="loginType"
              control={<Radio />}
              label="Register"
            />
          </RadioGroup>
          <Box>
            <Box>
              <TextField
                ref={emailRef}
                sx={{ my: 1, backgroundColor: "#f5f5f5", }}
                id="email"
                placeholder="Email Address"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
              />
              {actionData?.errors?.email && (
                <Box id="email-error">{actionData.errors.email}</Box>
              )}
            </Box>
          </Box>
          <Box>
            <Box>
              <TextField
                sx={{ my: 1, backgroundColor: "#f5f5f5", }}
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
              />
              {actionData?.errors?.password && (
                <Box id="password-error">{actionData.errors.password}</Box>
              )}
            </Box>
          </Box>
          <Button
            type="submit"
            sx={{
              fontFamily: "rasa",
              fontWeight: "bold",
              textTransform: "capitalize",
              pl: "1.5rem",
              pr: "1.5rem",
              pt: "8px",
              height: "1.75rem",
              alignSelf: "stretch",
            }}
            variant="outlined"
            color="primary"
          >
            Submit
          </Button>
        </Form>
        <Box sx={{ textAlign: "center" }}>
          <Typography>OR</Typography>
          <Form method="post" action={`/auth/${SocialsProvider.GOOGLE}`}>
            <Button
              type="submit"
              sx={{
                fontFamily: "rasa",
                fontWeight: "bold",
                textTransform: "capitalize",
                pl: "1.5rem",
                pr: "1.5rem",
                pt: "8px",
                height: "1.75rem",
                alignSelf: "stretch",
              }}
              color="primary"
            >
              <img
                src={GoogleLogo}
                style={{ height: "40px" }}
                alt="Black logo."
              />
              Login with Google
            </Button>
          </Form>
        </Box>
      </Box>
    </Box>
  );
}
