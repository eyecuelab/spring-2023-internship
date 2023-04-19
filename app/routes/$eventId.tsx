import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { deleteEvent, getEvent } from "~/models/events.server";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import Appbar from "~/components/Appbar";
import { Avatar, Box, Button, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import avatar from "../../public/img/avatar.png";
import MapImg from "~/images/map.png";
import React from "react";

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
  const { _action, ...values } = Object.fromEntries(formData);
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", { status: 404 });
  }
  if (_action === "delete") {
    await deleteEvent({ userId, id: eventId });
  }
  return redirect("/events");
  // invariant(params.eventId, "eventId not found");
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
                variant="outlined"
                color="primary"
                type="submit"
                name="_action"
                value="delete"
              >
                Unpublish
              </Button>
            </Form>
          </div>
          <Typography variant="h3" fontFamily="rasa" sx={{ mt: ".5rem" }}>
            {data.event.name}
          </Typography>
          {/* ------------------------------------------------------------------------------------------------------ */}
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
                {/* {data.event.summary} */}
                <Typography>{data.event.summary}</Typography>
                <Box sx={{ display: "flex", direction: "row", mt: "2rem" }}>
                  <Box sx={{}}>
                    <Typography sx={{ fontWeight: "bold", mt: "1rem" }}>
                      Location & Contact
                    </Typography>
                    {/* {data.event.address} */}
                    <Typography>
                      {data.event.streetAddress} {data.event.unit}
                    </Typography>
                    <Typography>
                      {data.event.city}, {data.event.state} {data.event.zip}
                    </Typography>
                    <Typography>(501) 778-1145</Typography>
                    <Typography>lucia.schmitt@gmail.com</Typography>
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
                        <div style={{ marginRight: ".5rem" }}>•</div>
                        <div style={{}}>{contribution.contributionName}</div>
                        <div style={{ marginLeft: "auto", paddingTop: "3px" }}>
                          Discussion
                        </div>
                        <div style={{ marginLeft: "2rem" }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{
                              fontFamily: "rasa",
                              textTransform: "capitalize",
                              pl: "1.5rem",
                              pr: "1.5rem",
                              pt: "8px",
                              height: "1.75rem",
                            }}
                            href=""
                          >
                            Claim Item
                          </Button>
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
          {/* ------------------------------------------------------------------------------------------------------ */}
        </div>
      </div>
    </div>
  );
}

// {
  /* {data.event.userId === data.userId ? (
                    <div>
                      <Form method="post">
                        <button type="submit" name="_action" value="delete" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
                          Delete
                        </button>
                      </Form>
                      <Link to="updateEvent">
                        <button type="submit" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
                          Update
                        </button>
                      </Link>
                    </div>
                  ) : (<div></div>)} */
// }
