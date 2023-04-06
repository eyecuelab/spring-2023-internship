import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";

import { createUser, getUserByEmail, verifyLogin } from "~/models/user.server";
import { badRequest } from "~/request.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

function validateEmail(email: unknown) {
  if (typeof email !== "string" && email.length > 3 && email.includes("@")) {
    return `Email is invalid`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

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
  if (
    typeof loginType !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      const user = await verifyLogin(email, password);

      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Username/Password combination is incorrect`,
        });
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

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
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
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  actionData?.fields?.loginType ===
                  "register"
                }
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="email-input">Email</label>
            <input
              type="text"
              id="email-input"
              name="email"
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.email
              )}
              aria-errormessage={
                actionData?.fieldErrors?.email
                  ? "email-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.email ? (
              <p
                className="form-validation-error"
                role="alert"
                id="email-error"
              >
                {actionData.fieldErrors.email}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.password
              )}
              aria-errormessage={
                actionData?.fieldErrors?.password
                  ? "password-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="form-validation-error"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <Link to="/">Home</Link>
      </div>
    </div>
  );
}