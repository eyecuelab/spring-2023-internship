import { getEvent, updateEvent } from "~/models/events.server";
import { useEffect, useRef } from "react";
import { requireUserId } from "~/session.server";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { updateContribution } from "~/models/contributions.server";
import { Delete } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import avatar from "../../public/img/avatar.png";
import Appbar from "~/components/Appbar";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", { status: 404 });
  }
  const event = await getEvent(eventId);
  if (!event) {
    throw new Response("Uh Oh! No event found.", { status: 404 });
  }
  if (event.userId !== userId) {
    throw new Response("Uh Oh! You do not have access to update this event.", {
      status: 403,
    });
  }
  return json({ event });
};

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  invariant(params.eventId, "eventId not found");
  // invariant(params.contributionId, "contributionId not found");

  const name = formData.get("name");
  const summary = formData.get("summary");
  const streetAddress = formData.get("streetAddress");
  const unit = formData.get("unit");
  const city = formData.get("city");
  const state = formData.get("state");
  const zip = formData.get("zip");
  const date = formData.get("dateTime");
  const contributionName = formData.get("contributionName");

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
          dateTime: null,
          contributionName: null,
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
          dateTime: null,
          contributionName: null,
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
          dateTime: null,
          contributionName: null,
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
          dateTime: null,
          contributionName: null,
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
          dateTime: null,
          contributionName: null,
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
          dateTime: null,
          contributionName: null,
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
          dateTime: null,
          contributionName: null,
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
          dateTime: "Date and Time is required",
          contributionName: null,
        },
      },
      { status: 400 }
    );
  }
  if (typeof contributionName !== "string" || contributionName.length === 0) {
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
          dateTime: null,
          contributionName: "Contribution name is required",
        },
      },
      { status: 400 }
    );
  }

  const id = params.eventId;
  const dateTime = new Date(date);
  await updateEvent({
    id,
    name,
    summary,
    streetAddress,
    dateTime,
    unit,
    city,
    state,
    zip,
    userId,
  });

  // await updateContribution({ contributionId, contributionName, id });



  return redirect(`/${id}`);
};

export default function UpdateEventRoute() {
  const data = useLoaderData();
  const dateTime = new Date(data.event.dateTime);

  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const dateTimeRef = useRef<HTMLInputElement>(null);
  const contributionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.summary) {
      summaryRef.current?.focus();
    } else if (actionData?.errors?.streetAddress) {
      addressRef.current?.focus();
    } else if (actionData?.errors?.unit) {
      unitRef.current?.focus();
    } else if (actionData?.errors?.city) {
      cityRef.current?.focus();
    } else if (actionData?.errors?.state) {
      stateRef.current?.focus();
    } else if (actionData?.errors?.zip) {
      zipRef.current?.focus();
    } else if (actionData?.errors?.dateTime) {
      dateTimeRef.current?.focus();
    } else if (actionData?.errors?.contributionName) {
      contributionRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <Appbar />
      <Form
        method="post"
        style={{
          backgroundColor: "rgb(245, 245, 245)",
          width: "53%",
          minHeight: "100%",
          maxHeight: "auto",
          position: "absolute",
        }}
      >
        <div style={{ margin: "8%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginLeft: "1rem",
                marginTop: "1rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src={avatar}
                sx={{ height: "60px", width: "60px" }}
              />
              <Box sx={{ pl: ".75rem" }}>
                <Typography sx={{ fontSize: ".75rem" }}>Created By</Typography>
                <Typography sx={{ fontSize: ".75rem", fontWeight: "bold" }}>
                  Lucia Schmitt
                </Typography>
              </Box>
            </div>

            <Box sx={{ display: "flex" }}>
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
            </Box>
          </div>

          <TextField
            sx={{ mt: ".5rem", width: "100%" }}
            ref={nameRef}
            name="name"
            placeholder="name"
            defaultValue={data.event.name}
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
              <TextField
                sx={{ width: "100%" }}
                name="summary"
                defaultValue={data.event.summary}
              ></TextField>
              <Box sx={{ display: "flex", direction: "row", mt: "2rem" }}>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                    Location & Contact
                  </Typography>

                  <TextField
                    ref={addressRef}
                    name="streetAddress"
                    placeholder="street address"
                    defaultValue={data.event.streetAddress}
                    aria-invalid={
                      actionData?.errors?.streetAddress ? true : undefined
                    }
                    aria-errormessage={
                      actionData?.errors?.streetAddress
                        ? "address-error"
                        : undefined
                    }
                  />
                  {actionData?.errors?.streetAddress && (
                    <div className="pt-1 text-red-700" id="address-error">
                      {actionData.errors.streetAddress}
                    </div>
                  )}

                  <TextField
                    ref={unitRef}
                    name="unit"
                    placeholder="unit #"
                    defaultValue={data.event.unit}
                    aria-invalid={actionData?.errors?.unit ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.unit ? "unit-error" : undefined
                    }
                  />
                  {actionData?.errors?.unit && (
                    <div className="pt-1 text-red-700" id="unit-error">
                      {actionData.errors.unit}
                    </div>
                  )}

                  <TextField
                    ref={cityRef}
                    name="city"
                    placeholder="city"
                    defaultValue={data.event.city}
                    aria-invalid={actionData?.errors?.city ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.city ? "city-error" : undefined
                    }
                  />
                  {actionData?.errors?.city && (
                    <div className="pt-1 text-red-700" id="city-error">
                      {actionData.errors.city}
                    </div>
                  )}

                  <TextField
                    ref={stateRef}
                    name="state"
                    placeholder="state"
                    defaultValue={data.event.state}
                    aria-invalid={actionData?.errors?.state ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.state ? "state-error" : undefined
                    }
                  />
                  {actionData?.errors?.state && (
                    <div className="pt-1 text-red-700" id="state-error">
                      {actionData.errors.state}
                    </div>
                  )}

                  <TextField
                    ref={zipRef}
                    name="zip"
                    placeholder="zip"
                    defaultValue={data.event.zip}
                    aria-invalid={actionData?.errors?.zip ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.zip ? "zip-error" : undefined
                    }
                  />
                  {actionData?.errors?.zip && (
                    <div className="pt-1 text-red-700" id="zip-error">
                      {actionData.errors.zip}
                    </div>
                  )}
                </Box>
              </Box>

              <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                Date & Time
              </Typography>
              <Input
                ref={dateTimeRef}
                type="dateTime-local"
                name="dateTime"
                defaultValue={dateTime}
                aria-invalid={actionData?.errors?.dateTime ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.dateTime ? "dateTime-error" : undefined
                }
              />
              {actionData?.errors?.dateTime && (
                <div className="pt-1 text-red-700" id="dateTime-error">
                  {actionData.errors.dateTime}
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
                <TextField
                  ref={contributionRef}
                  sx={{ width: "100%" }}
                  name="contributionName"
                  defaultValue={data.event.contributions[0].contributionName}
                  aria-invalid={
                    actionData?.errors?.contributionName ? true : undefined
                  }
                  aria-errormessage={
                    actionData?.errors?.contributionName
                      ? "contributionName-error"
                      : undefined
                  }
                />
                {actionData?.errors?.contributionName && (
                  <div
                    className="pt-1 text-red-700"
                    id="contributionName-error"
                  >
                    {actionData.errors.contributionName}
                  </div>
                )}
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
