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
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import avatar from "../../public/img/avatar.png";
import Appbar from "~/components/Appbar";
import { Delete } from "@mui/icons-material";
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
    <div>
      <Appbar />
      <Form
        style={{
          backgroundColor: "rgb(245, 245, 245)",
          width: "53%",
          minHeight: "100%",
          maxHeight: "auto",
          position: "absolute",
        }}
      >
        <div style={{ margin: "8%" }}>
          <div style={{ display: "flex" }}>
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
          </div>
          <TextField
            sx={{ mt: ".5rem", width: "100%" }}
            ref={titleRef}
            name="title"
            placeholder="Title"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
          {/* ------------------------------------------------------------------------------------------------------ */}
          <Box sx={{ width: "100%", mt: "1rem" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Typography sx={{ borderBottom: 1, borderColor: "divider" }}>
                Details
              </Typography>
            </Box>

            <Box sx={{ mt: "1rem" }}>
              <Typography sx={{ fontWeight: "bold" }}>Summary</Typography>
              {/* {data.event.description} */}
              <TextField sx={{ width: "100%" }}></TextField>
              <Box sx={{ display: "flex", direction: "row", mt: "2rem" }}>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                    Location & Contact
                  </Typography>
                  {/* {data.event.address} */}
                  <TextField
                    ref={addressRef}
                    name="address"
                    placeholder="street address"
                    aria-invalid={
                      actionData?.errors?.address ? true : undefined
                    }
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
                </Box>
              </Box>

              <Box style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: "bold", mt: "2rem" }}>
                    claim your contributions
                  </Typography>
                  <Typography>
                    let your guests know how they can contribute!
                  </Typography>
                </Box>
                <Button
                  sx={{
                    fontFamily: "rasa",
                    textTransform: "capitalize",
                    pl: "1.5rem",
                    pr: "1.5rem",
                    pt: "8px",
                    height: "1.75rem",
                  }}
                  variant="outlined"
                  color="primary"
                  href=""
                >
                  Add An Item
                </Button>
              </Box>

              <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField sx={{ width: "100%" }} placeholder="" />
                <IconButton aria-label="delete" size="small">
                  <Delete fontSize="inherit" />
                </IconButton>
                <div style={{ marginLeft: "2rem" }}></div>
              </div>
              <hr style={{ borderTop: "1px dashed #bbb" }} />
            </Box>
          </Box>
          {/* ------------------------------------------------------------------------------------------------------ */}
        </div>
      </Form>
    </div>
  );
}
