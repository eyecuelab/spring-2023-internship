import React, { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import avatar from "../../public/img/avatar.png";
import Appbar from "~/components/Appbar";
import { deleteEvent, getEvent } from "~/models/events.server";
import { requireUserId } from "~/services/session.server";
import MapImg from "~/images/map.png";

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
    <Box
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
    </Box>
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
  const [viewport, setViewport] = useState({
    latitude: 45.5152,
    longitude: 122.6784,
    zoom: 8
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Appbar />
      <Box
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
                src={avatar}
                sx={{ height: "60px", width: "60px" }}
              />
              <Box sx={{ pl: ".75rem" }}>
                <Typography sx={{ fontSize: ".75rem" }}>Created By</Typography>
                <Typography sx={{ fontSize: ".75rem", fontWeight: "bold" }}>
                  Lucia Schmitt
                </Typography>
              </Box>
            </Box>

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
          </Box>
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
                      // backgroundImage: `url(https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.6729,45.5148,9.65,0/300x200?access_token=${process.env.REACT_APP_MAPBOX_TOKEN})`,
                      border: "1px solid #D3D3D3",
                      width: "530px",
                      height: "264px",
                      borderRadius: "3px",
                      ml: "80px",
                      mt: "1rem",
                    }}
                    id="map"
                  >
                    <ReactMapGL
                      {...viewport}
                      width="100%"
                      height="100%"
                      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                      onViewportChange={setViewport}
                    >
                      <Marker latitude={45.5152} longitude={122.6784}>
                        <div>Marker</div>
                      </Marker>
                    </ReactMapGL>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: "bold", mt: "2rem" }}>
                  claim your contributions
                </Typography>
                <Typography>
                  show your generosity and claim a few items to Bring with you!
                </Typography>
                <ul style={{ listStyleType: "none", padding: "0" }}>
                  {data.event.contributions.map((contribution: any) => (
                    <li key={contribution.id}>
                      <Box style={{ display: "flex", flexDirection: "row" }}>
                        <Box style={{ marginRight: ".5rem" }}>•</Box>
                        <Box style={{}}>{contribution.contributionName}</Box>
                        <Box style={{ marginLeft: "auto", paddingTop: "3px" }}>
                          Discussion
                        </Box>
                        <Box style={{ marginLeft: "2rem" }}>
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
                        </Box>
                      </Box>
                      <hr style={{ borderTop: "1px dashed #bbb" }} />
                    </li>
                  ))}
                </ul>
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
        </Box>
      </Box>
    </Box>
  );
}

// {
/* {data.event.userId === data.userId ? (
                    <Box>
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
                    </Box>
                  ) : (<Box></Box>)} */
// }
