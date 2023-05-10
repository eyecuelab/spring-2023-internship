import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import invariant from "tiny-invariant";

import type { ActionArgs, LoaderFunction } from "@remix-run/node";

import Appbar from "~/components/Appbar";
import {
  createContribution,
  updateContribution,
  getContributions,
  deleteContribution,
} from "~/models/contributions.server";
import { getEvent, updateEvent } from "~/models/events.server";
import { requireUserId } from "~/services/session.server";
import { useUser } from "~/utils/utils";

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

  const { _action, ...values } = Object.fromEntries(formData);
  if (typeof _action !== "string") return null;
  const updatedContributions = JSON.parse(_action);
  const contributions = await getContributions(id);

  if (updatedContributions.length === 0 && contributions.length > 0) {
    contributions.forEach(async (e) => {
      await deleteContribution({ id: e.id });
    });
  }

  if (contributions.length === 0 && updatedContributions.length > 0) {
    updatedContributions.forEach(async (e: { name: any }) => {
      if (e.name !== "") {
        await createContribution({ contributionName: e.name, eventId: id });
      }
    });
  }

  if (contributions.length > 0 && updatedContributions.length > 0) {
    contributions.forEach(async (e) => {
      let remove = true;
      for (let i = 0; i < updatedContributions.length; i++) {
        if (e.id === updatedContributions[i].id) {
          remove = false;
          if (e.contributionName !== updatedContributions[i].name) {
            await updateContribution({
              id: updatedContributions[i].id,
              contributionName: updatedContributions[i].name,
            });
          }
        }
      }
      if (remove) {
        await deleteContribution({ id: e.id });
      }
    });
    updatedContributions.forEach(async (e: { id: string; name: any }) => {
      if (e.id === "" && e.name !== "") {
        await createContribution({ contributionName: e.name, eventId: id });
      }
    });
  }

  return redirect(`/${id}`);
};

export default function UpdateEventRoute() {
  const user = useUser();
  const data = useLoaderData();

  const actionData = useActionData();
  const nameRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const dateTimeRef = useRef<HTMLInputElement>(null);

  const contributions = data.event.contributions;
  const currentFormValues: { name: string; id: string }[] = [];
  if (contributions) {
    contributions.forEach((e: { contributionName: string; id: string }) => {
      currentFormValues.push({ name: e.contributionName, id: e.id });
    });
  }
  const [formValues, setFormValues] = useState<{ name: string; id: string }[]>(
    currentFormValues.length === 0 ? [{ name: "", id: "" }] : currentFormValues
  );

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
    setFormValues([...formValues, { name: "", id: "" }]);
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
                name="_action"
                value={JSON.stringify(formValues)}
              >
                Publish
              </Button>
            </Box>
          </Box>
          <TextField
            sx={{
              mt: ".5rem",
              width: "100%",
              backgroundColor: "white",
              outline: "none",
            }}
            ref={nameRef}
            name="name"
            defaultValue={data.event.name}
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
            }
          />
          <Box sx={{ width: "100%", mt: "1rem" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Typography sx={{ borderBottom: 1, borderColor: "divider" }}>
                Details
              </Typography>
            </Box>
            <Box sx={{ mt: "1rem" }}>
              <Typography variant="h6">Summary</Typography>
              <TextField
                sx={{ width: "100%", backgroundColor: "white" }}
                name="summary"
                defaultValue={data.event.summary}
              />
              <Box sx={{ display: "flex", direction: "row", mt: "2rem" }}>
                <Box>
                  <Typography variant="h6" sx={{ mt: "1rem" }}>
                    Location & Contact
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                        Street Address
                      </Typography>
                      <TextField
                        sx={{ backgroundColor: "white", minWidth: "100%" }}
                        ref={addressRef}
                        name="streetAddress"
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
                        <Box className="pt-1 text-red-700" id="address-error">
                          {actionData.errors.streetAddress}
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                        Unit#
                      </Typography>
                      <TextField
                        sx={{ backgroundColor: "white", minWidth: "100%" }}
                        ref={unitRef}
                        name="unit"
                        defaultValue={data.event.unit}
                        aria-invalid={
                          actionData?.errors?.unit ? true : undefined
                        }
                        aria-errormessage={
                          actionData?.errors?.unit ? "unit-error" : undefined
                        }
                      />
                      {actionData?.errors?.unit && (
                        <Box className="pt-1 text-red-700" id="unit-error">
                          {actionData.errors.unit}
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                        City
                      </Typography>
                      <TextField
                        sx={{ backgroundColor: "white", minWidth: "100%" }}
                        ref={cityRef}
                        name="city"
                        defaultValue={data.event.city}
                        aria-invalid={
                          actionData?.errors?.city ? true : undefined
                        }
                        aria-errormessage={
                          actionData?.errors?.city ? "city-error" : undefined
                        }
                      />
                      {actionData?.errors?.city && (
                        <Box className="pt-1 text-red-700" id="city-error">
                          {actionData.errors.city}
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                        State
                      </Typography>
                      <TextField
                        sx={{ backgroundColor: "white", minWidth: "100%" }}
                        ref={stateRef}
                        name="state"
                        defaultValue={data.event.state}
                        aria-invalid={
                          actionData?.errors?.state ? true : undefined
                        }
                        aria-errormessage={
                          actionData?.errors?.state ? "state-error" : undefined
                        }
                      />
                      {actionData?.errors?.state && (
                        <Box className="pt-1 text-red-700" id="state-error">
                          {actionData.errors.state}
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                        Zip
                      </Typography>
                      <TextField
                        sx={{ backgroundColor: "white", minWidth: "100%" }}
                        ref={zipRef}
                        name="zip"
                        defaultValue={data.event.zip}
                        aria-invalid={
                          actionData?.errors?.zip ? true : undefined
                        }
                        aria-errormessage={
                          actionData?.errors?.zip ? "zip-error" : undefined
                        }
                      />
                      {actionData?.errors?.zip && (
                        <Box className="pt-1 text-red-700" id="zip-error">
                          {actionData.errors.zip}
                        </Box>
                      )}
                    </Grid>
                  </Grid>
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
                defaultValue={data.event.dateTime.slice(0, -5)}
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
                  <Typography variant="h6" sx={{ mt: "2rem" }}>
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
