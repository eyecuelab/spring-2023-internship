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
  const name = formData.get("name");
  const summary = formData.get("summary");
  const streetAddress = formData.get("streetAddress");
  const unit = formData.get("unit");
  const city = formData.get("city");
  const state = formData.get("state");
  const zip = formData.get("zip");
  const date = formData.get("dateTime");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      {
        errors: {
          name: "Title is required",
          summary: null,
          streetAddress: null,
          unit: null,
          city: null,
          state: null,
          zip: null,
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof summary !== "string" || summary.length === 0) {
    return json(
      {
        errors: {
          name: null,
          summary: "Event Summary is required",
          streetAddress: null,
          unit: null,
          city: null,
          state: null,
          zip: null,
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof streetAddress !== "string" || streetAddress.length === 0) {
    return json(
      {
        errors: {
          name: null,
          summary: null,
          streetAddress: "Address is required",
          unit: null,
          city: null,
          state: null,
          zip: null,
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof unit !== "string" || unit.length === 0) {
    return json(
      {
        errors: {
          name: null,
          summary: null,
          streetAddress: null,
          unit: "Unit is required",
          city: null,
          state: null,
          zip: null,
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof city !== "string" || city.length === 0) {
    return json(
      {
        errors: {
          name: null,
          summary: null,
          streetAddress: null,
          unit: null,
          city: "City is Required",
          state: null,
          zip: null,
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof state !== "string" || state.length === 0) {
    return json(
      {
        errors: {
          name: null,
          summary: null,
          streetAddress: null,
          unit: null,
          city: null,
          state: "State is required",
          zip: null,
          datetime: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof zip !== "string" || zip.length === 0) {
    return json(
      {
        errors: {
          name: null,
          summary: null,
          streetAddress: null,
          unit: null,
          city: null,
          state: null,
          zip: "zip is required",
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
          name: null,
          summary: null,
          streetAddress: null,
          unit: null,
          city: null,
          state: null,
          zip: null,
          datetime: "Date and Time is required",
        },
      },
      { status: 400 }
    );
  }

  const dateTime = new Date(date);
  const event = await createEvent({
    name,
    summary,
    streetAddress,
    unit,
    city,
    state,
    zip,
    dateTime,
    userId,
  });

  return redirect(`/events/${event.id}`);
};

export default function NewEventRoute() {
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const dateTimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.summary) {
      summaryRef.current?.focus();
    } else if (actionData?.errors?.streetAddress) {
      addressRef.current?.focus();
    } else if (actionData?.errors?.datetime) {
      dateTimeRef.current?.focus();
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
            <Button
              sx={{
                fontFamily: "rasa",
                textTransform: "capitalize",
                pl: "1.5rem",
                pr: "1.5rem",
                pt: "8px",
                height: "1.75rem",
                alignSelf: "stretch",
              }}
              variant="outlined"
              color="primary"
              type="submit"
            >
              Publish
            </Button>
          </div>
          <TextField
            sx={{ mt: ".5rem", width: "100%" }}
            ref={nameRef}
            name="name"
            placeholder="name"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
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
              {/* {data.event.summary} */}
              <TextField sx={{ width: "100%" }} name="summary"></TextField>
              <Box sx={{ display: "flex", direction: "row", mt: "2rem" }}>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                    Location & Contact
                  </Typography>
                  {/* {data.event.address} */}
                  <TextField
                    ref={addressRef}
                    name="streetAddress"
                    placeholder="street address"
                    aria-invalid={
                      actionData?.errors?.streetAddress ? true : undefined
                    }
                    aria-errormessage={
                      actionData?.errors?.streetAddress ? "address-error" : undefined
                    }
                  />
                  {actionData?.errors?.streetAddress && (
                    <div className="pt-1 text-red-700" id="address-error">
                      {actionData.errors.streetAddress}
                    </div>
                  )}
                  <TextField name="city" placeholder="city" />
                  <TextField name="unit" placeholder="unit #" />
                  <TextField name="state" placeholder="state" />
                  <TextField name="zip" placeholder="zip" />
                </Box>
              </Box>

              <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                    Date & Time
                  </Typography>
              <input
                ref={dateTimeRef}
                type="datetime-local"
                name="datetime"
                aria-invalid={actionData?.errors?.datetime ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.datetime ? "datetime-error" : undefined
                }
              />
              {actionData?.errors?.datetime && (
                <div className="pt-1 text-red-700" id="datetime-error">
                  {actionData.errors.datetime}
                </div>
              )}

              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
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
