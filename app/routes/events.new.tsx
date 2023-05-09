import { useEffect, useRef, useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/services/session.server";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

import type { ActionArgs, LoaderFunction } from "@remix-run/node";

import { createEvent } from "~/models/events.server";
import { createContribution } from "~/models/contributions.server";
import { useUser } from "~/utils/utils";
import Appbar from "~/components/Appbar";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  return json({});
};

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
  if (typeof unit !== "string") {
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
  const eventId = event.id;

  const { _action, ...values } = Object.fromEntries(formData);
  if (typeof _action !== "string") return null;
  const contributions = JSON.parse(_action);

  contributions.forEach(async (e: { name: string }) => {
    if (e.name !== "") {
      const contributionName = e.name;
      await createContribution({ contributionName, eventId });
    }
  });

  return redirect(`/${event.id}`);
};

export default function NewEventRoute() {
  const user = useUser();
  const actionData = useActionData();
  const nameRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const dateTimeRef = useRef<HTMLInputElement>(null);

  const [formValues, setFormValues] = useState<{ name: string }[]>([
    { name: "" },
  ]);

  const handleChange = (
    i: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newFormValues = [...formValues];

    const value = e.target.value;
    (newFormValues[i] as { name: string }).name = value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([...formValues, { name: "" }]);
  };

  const removeFormFields = (i: number) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

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
    }
  }, [actionData]);

  return (
    <Box>
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
        <Box style={{ margin: "8%" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
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
                src={user.picture !== null ? user.picture : ""}
                sx={{ width: 60, height: 60 }}
              />
              <Box sx={{ pl: ".75rem" }}>
                <Typography sx={{ fontSize: ".75rem" }}>Created By</Typography>
                <Typography sx={{ fontSize: ".75rem", fontWeight: "bold" }}>
                  {user.displayName !== null ? user.displayName : user.email}
                </Typography>
              </Box>
            </Box>
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
              name="_action"
              value={JSON.stringify(formValues)}
            >
              Publish
            </Button>
          </Box>
          <TextField
            sx={{ mt: ".5rem", width: "100%", backgroundColor: "white" }}
            ref={nameRef}
            name="name"
            placeholder="name"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
            }
          />
          {actionData?.errors?.name && (
            <Box className="pt-1 text-red-700" id="name">
              {actionData.errors.name}
            </Box>
          )}
          <Box sx={{ width: "100%", mt: "1rem" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Typography sx={{ borderBottom: 1, borderColor: "divider" }}>
                Details
              </Typography>
            </Box>
            <Box sx={{ mt: "1rem" }}>
              <Typography sx={{ fontWeight: "bold" }}>Summary</Typography>
              <TextField
                sx={{ width: "100%", backgroundColor: "white" }}
                ref={summaryRef}
                name="summary"
                placeholder="summary"
                aria-invalid={actionData?.errors?.summary ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.summary ? "summary-error" : undefined
                }
              />
              {actionData?.errors?.summary && (
                <Box className="pt-1 text-red-700" id="summary">
                  {actionData.errors.summary}
                </Box>
              )}
              <Box sx={{ display: "flex", direction: "row", mt: "2rem" }}>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                    Location & Contact
                  </Typography>
                  <TextField
                    sx={{ backgroundColor: "white" }}
                    ref={addressRef}
                    name="streetAddress"
                    placeholder="street address"
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
                    <Box className="pt-1 text-red-700" id="address-error">
                      {actionData.errors.streetAddress}
                    </Box>
                  )}
                  <TextField
                    sx={{ backgroundColor: "white" }}
                    ref={unitRef}
                    name="unit"
                    placeholder="unit #"
                    aria-invalid={actionData?.errors?.unit ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.unit ? "unit-error" : undefined
                    }
                  />
                  {actionData?.errors?.unit && (
                    <Box className="pt-1 text-red-700" id="unit-error">
                      {actionData.errors.unit}
                    </Box>
                  )}
                  <TextField
                    sx={{ backgroundColor: "white" }}
                    ref={cityRef}
                    name="city"
                    placeholder="city"
                    aria-invalid={actionData?.errors?.city ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.city ? "city-error" : undefined
                    }
                  />
                  {actionData?.errors?.city && (
                    <Box className="pt-1 text-red-700" id="city-error">
                      {actionData.errors.city}
                    </Box>
                  )}
                  <TextField
                    sx={{ backgroundColor: "white" }}
                    ref={stateRef}
                    name="state"
                    placeholder="state"
                    aria-invalid={actionData?.errors?.state ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.state ? "state-error" : undefined
                    }
                  />
                  {actionData?.errors?.state && (
                    <Box className="pt-1 text-red-700" id="state-error">
                      {actionData.errors.state}
                    </Box>
                  )}
                  <TextField
                    sx={{ backgroundColor: "white" }}
                    ref={zipRef}
                    name="zip"
                    placeholder="zip"
                    aria-invalid={actionData?.errors?.zip ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.zip ? "zip-error" : undefined
                    }
                  />
                  {actionData?.errors?.zip && (
                    <Box className="pt-1 text-red-700" id="zip-error">
                      {actionData.errors.zip}
                    </Box>
                  )}
                </Box>
              </Box>
              <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                Date & Time
              </Typography>
              <Input
                sx={{ backgroundColor: "white" }}
                ref={dateTimeRef}
                type="dateTime-local"
                name="dateTime"
                aria-invalid={actionData?.errors?.dateTime ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.dateTime ? "dateTime-error" : undefined
                }
              />
              {actionData?.errors?.dateTime && (
                <Box className="pt-1 text-red-700" id="dateTime-error">
                  {actionData.errors.dateTime}
                </Box>
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
                  onClick={() => addFormFields()}
                  variant="outlined"
                  color="primary"
                  href=""
                >
                  Add An Item
                </Button>
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ul
                  style={{ listStyleType: "none", padding: "0", width: "100%" }}
                >
                  {formValues.map((element, index) => (
                    <li className="form-inline" key={index}>
                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                          sx={{ width: "100%", backgroundColor: "white" }}
                          onChange={(e) => handleChange(index, e)}
                          name="contributionName"
                          value={element.name || ""}
                        />
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={() => removeFormFields(index)}
                        >
                          <Delete fontSize="inherit" />
                        </IconButton>
                      </Box>
                      {index !== formValues.length - 1 ? (
                        <hr
                          style={{
                            borderTop: "1px dashed #bbb",
                            width: "100%",
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </li>
                  ))}
                </ul>
              </Box>
            </Box>
          </Box>
        </Box>
      </Form>
    </Box>
  );
}
