import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";

import { createUser, getUserByEmail, verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils/utils";

export const loader = async ({ request }: LoaderArgs) => {
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
}

export default function Login() {
  const actionData = useActionData<typeof action>();
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
    <div style={{ backgroundColor: "white", width: "53%", height: "100%", position: "absolute" }}>
      <div data-light="" style={{ marginTop: "25%", marginLeft: "15%", marginRight: "22%"}}>
        <h1>Login/Register</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={redirectTo}
          />
          <fieldset>
            <legend className="sr-only">
              Login or Register?
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={true}
                // defaultChecked={
                //   actionData?.fields?.loginType ===
                //   "login"
                // }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                // defaultChecked={
                //   actionData?.fields?.loginType ===
                //   "register"
                // }
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label
              htmlFor="email"
            >
              Email address
            </label>
            <div>
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
              />
              {actionData?.errors?.email && (
                <div id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
            >
              Password
            </label>
            <div>
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
              />
              {actionData?.errors?.password && (
                <div id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
        <div className="links">
          <Link to="/">Home</Link>
        </div>
      </div>
    </div>
  );
}