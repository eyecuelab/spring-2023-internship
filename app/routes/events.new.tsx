import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createEvent } from "~/models/events.server";
import { useEffect, useRef } from "react";
import { requireUserId } from "~/session.server";
import {
  Avatar,
  Box,
  Button,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import avatar from "../../public/img/avatar.png";
import Appbar from "~/components/Appbar";

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const address = formData.get("address");
  const date = formData.get("datetime");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      {
        errors: {
          description: null,
          title: "Title is required",
          address: null,
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof description !== "string" || description.length === 0) {
    return json(
      {
        errors: {
          description: "Description is required",
          title: null,
          address: null,
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof address !== "string" || address.length === 0) {
    return json(
      {
        errors: {
          description: null,
          title: null,
          address: "Address is required",
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof date !== "string" || date.length === 0) {
    return json(
      {
        errors: {
          description: null,
          title: null,
          address: null,
          datetime: "Date and Time is required",
        },
      },
      { status: 400 }
    );
  }

  const dateTime = new Date(date);
  const event = await createEvent({
    title,
    description,
    address,
    dateTime,
    userId,
  });

  return redirect(`/events/${event.id}`);
};

export default function NewEventRoute() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const datetimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    } else if (actionData?.errors?.address) {
      addressRef.current?.focus();
    } else if (actionData?.errors?.datetime) {
      datetimeRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Box>
      <Appbar />
      <div
        style={{
          backgroundColor: "rgb(245, 245, 245)",
          width: "53vw",
          height: "100vh",
          position: "absolute",
        }}
      >
        <div style={{ margin: "8%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src={avatar}
              sx={{ height: "60px", width: "60px" }}
            />

            <div style={{ marginLeft: "1rem", marginTop: "1rem" }}>
              <Typography sx={{ fontSize: ".75rem" }}>Created By</Typography>
              <Typography sx={{ fontSize: ".75rem", fontWeight: "bold" }}>
                Lucia Schmitt
              </Typography>
            </div>

            <Button
              variant="outlined"
              color="primary"
              sx={{
                maxWidth: "80px",
                maxHeight: "30px",
                minWidth: "30px",
                minHeight: "30px",
              }}
            >
              Publish
            </Button>
          </div>

          <Form
            method="post"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
            }}
          >
            <label className="flex w-full flex-col gap-1">
              <TextField
                ref={titleRef}
                name="title"
                className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                placeholder="title"
                aria-invalid={actionData?.errors?.title ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.title ? "title-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.title && (
              <div className="pt-1 text-red-700" id="title-error">
                {actionData.errors.title}
              </div>
            )}

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Typography sx={{ borderBottom: 1, borderColor: "divider" }}>
                Details
              </Typography>
            </Box>

            <div>
              <span>Summary</span>
              <br />
              <TextField
                ref={descriptionRef}
                name="description"
                rows={8}
                className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
                aria-invalid={
                  actionData?.errors?.description ? true : undefined
                }
                aria-errormessage={
                  actionData?.errors?.description
                    ? "description-error"
                    : undefined
                }
              />
              {actionData?.errors?.description && (
                <div className="pt-1 text-red-700" id="description-error">
                  {actionData.errors.description}
                </div>
              )}
            </div>

            <div>
              <span>Location and Contact</span>
              <br />
              <TextField
                ref={addressRef}
                name="address"
                placeholder="street address"
                aria-invalid={actionData?.errors?.address ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.address ? "address-error" : undefined
                }
              />
              {actionData?.errors?.address && (
                <div className="pt-1 text-red-700" id="address-error">
                  {actionData.errors.address}
                </div>
              )}
              <TextField name="city" placeholder="city" />
              <TextField
                name="building / unit #"
                placeholder="building / unit #"
              />
              <TextField name="state" placeholder="state" />
              <TextField name="zip" placeholder="zip" />
            </div>

            <div>
              <label className="flex w-full flex-col gap-1">
                <span>Date and Time: </span>
                <input
                  ref={datetimeRef}
                  type="datetime-local"
                  name="datetime"
                  aria-invalid={actionData?.errors?.datetime ? true : undefined}
                  aria-errormessage={
                    actionData?.errors?.datetime ? "datetime-error" : undefined
                  }
                />
              </label>
              {actionData?.errors?.datetime && (
                <div className="pt-1 text-red-700" id="datetime-error">
                  {actionData.errors.datetime}
                </div>
              )}
            </div>

            <span>Contributions</span>
          </Form>
        </div>
      </div>
    </Box>
  );
}
