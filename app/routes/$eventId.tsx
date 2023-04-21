import React from "react";
import { useLoaderData, Form, Link } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Avatar, Box, Button, Typography, Tabs, Tab } from "@mui/material";

import Appbar from "~/components/Appbar";
import { deleteEvent, getEvent } from "~/models/events.server";
import {
  claimItem,
  getContribution,
  unclaimItem,
} from "~/models/contributions.server";
import { requireUserId } from "~/services/session.server";

import avatar from "../../public/img/avatar.png";
import MapImg from "~/images/map.png";
import Checkmark from "~/images/checkmark.png";

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

  return json({ event, userId });
};

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", { status: 404 });
  }

  const { _action, ...values } = Object.fromEntries(formData);
  if (_action === "delete") {
    await deleteEvent({ userId, id: eventId });
  }
  if (typeof _action !== "string") {
    return null;
  }
  const contribution = await getContribution(_action);

  if (contribution !== null) {
    if (contribution.userId === null) {
      await claimItem(contribution.id, userId);
    } else {
      await unclaimItem(contribution.id);
    }
  }

  return null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EventRoute() {
  const data = useLoaderData();
  const dateTime = new Date(data.event.dateTime);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Appbar />
      <div
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
              <img
                alt="Remy Sharp"
                src={data.event.user.picture}
                style={{ height: "60px", width: "60px", borderRadius: "30px" }}
              />
              <Box sx={{ pl: ".75rem" }}>
                <Typography sx={{ fontSize: ".75rem" }}>Created By</Typography>
                <Typography sx={{ fontSize: ".75rem", fontWeight: "bold" }}>
                  {data.event.user.displayName !== null
                    ? data.event.user.displayName
                    : data.event.user.email}
                </Typography>
              </Box>
            </div>

            <Box sx={{ display: "flex" }}>
              <Form method="post">
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
                  variant="text"
                  color="primary"
                  type="submit"
                  name="_action"
                  value="delete"
                >
                  Unpublish
                </Button>
              </Form>
              <Link to="updateEvent">
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
                >
                  Update
                </Button>
              </Link>
            </Box>
          </div>
          <Typography variant="h3" fontFamily="rasa" sx={{ mt: ".5rem" }}>
            {data.event.name}
          </Typography>
          <Box sx={{ width: "100%", mt: "1rem" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  sx={{ fontSize: ".75rem", fontWeight: "bold" }}
                  label="Details"
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{ fontSize: ".75rem", fontWeight: "bold" }}
                  label="Memories"
                  {...a11yProps(1)}
                />
                <Tab
                  sx={{ fontSize: ".75rem", fontWeight: "bold" }}
                  label="Connections"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Box sx={{ mt: "1rem" }}>
                <Typography sx={{ fontWeight: "bold" }}>Summary</Typography>
                <Typography>{data.event.summary}</Typography>
                <Box sx={{ display: "flex", direction: "row", mt: "2rem" }}>
                  <Box sx={{}}>
                    <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                      Location & Contact
                    </Typography>
                    <Typography>
                      {data.event.streetAddress} {data.event.unit}
                    </Typography>
                    <Typography>
                      {data.event.city}, {data.event.state} {data.event.zip}
                    </Typography>
                    <br />
                    <Typography>(501) 778-1145</Typography>
                    <Typography>{data.event.user.email}</Typography>
                    <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                      Date and Time
                    </Typography>
                    <Typography
                      sx={{ whiteSpace: "nowrap" }}
                    >{`${dateTime.toDateString()} - ${dateTime.toLocaleTimeString()}`}</Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundImage: `url(${MapImg})`,
                      border: "1px solid #D3D3D3",
                      width: "530px",
                      height: "264px",
                      borderRadius: "3px",
                      ml: "80px",
                      mt: "1rem",
                    }}
                  ></Box>
                </Box>
                <Typography sx={{ fontWeight: "bold", mt: "2rem" }}>
                  claim your contributions
                </Typography>
                <Typography>
                  show your generosity and claim a few items to Bring with you!
                </Typography>
                {data.event.contributions.map((contribution: any) => (
                  <ul style={{ listStyleType: "none", padding: "0" }}>
                    <li key={contribution.id}>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ marginRight: ".5rem" }}>
                          {contribution.user ? 
                            <img
                              alt="Checkmark"
                              src={Checkmark}
                              style={{
                                height: "7px",
                                width: "7px",
                              }}
                            /> :
                            "•"
                          }
                        </div>
                        <div style={ contribution.user ? { fontWeight: "bold"} : {} }>{contribution.contributionName}</div>
                        <div style={{ marginLeft: "auto", paddingTop: "3px" }}>
                          Discussion
                        </div>
                        <div style={{ marginLeft: "2rem" }}>
                          {contribution.user !== null &&
                          contribution.userId !== data.userId ? (
                            <img
                              alt="Remy Sharp"
                              src={contribution.user.picture}
                              style={{
                                height: "1.75rem",
                                width: "1.75rem",
                                borderRadius: "30px",
                                marginRight: "40px",
                                marginLeft: "41px",
                              }}
                            />
                          ) : (
                            <form method="post">
                              <Button
                                name="_action"
                                value={contribution.id}
                                type="submit"
                                variant="outlined"
                                color="primary"
                                sx={{
                                  fontFamily: "rasa",
                                  textTransform: "capitalize",
                                  width: "110px",
                                  pt: "8px",
                                  height: "1.75rem",
                                }}
                                href=""
                              >
                                {contribution.userId === data.userId
                                  ? "Unclaim Item"
                                  : "Claim Item"}
                              </Button>
                            </form>
                          )}
                        </div>
                      </div>
                    </li>
                    <hr style={{ borderTop: "1px dashed #bbb" }} />
                  </ul>
                ))}
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
          </Box>
        </div>
      </div>
    </div>
  );
}
