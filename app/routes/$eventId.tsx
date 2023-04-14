import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { deleteEvent, getEvent } from "~/models/events.server"
import { useLoaderData, Form, Link } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { createAttendee, getAttendeesByEventId, isAttendee } from "~/models/attendee.server";
import Appbar from "~/components/Appbar";
import { Avatar, Box, Typography } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import avatar from "../../public/img/avatar.png";
import React from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", {status: 404})
  }

  const event = await getEvent(eventId);
  if (!event) {
    throw new Response("Uh Oh! No event found.", {status: 404});
  }

  const attendees = await getAttendeesByEventId(eventId);
  if (!attendees) {
    return json({ event, userId });
  }
  
  return json({ event, userId, attendees });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", {status: 404})
  }
  // invariant(params.eventId, "eventId not found");

  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  if (_action === "delete") {
    await deleteEvent({ userId, id: eventId });
    return redirect("/events");
  }
  if (_action === "create") {
    const attendee = await isAttendee(userId, eventId);
    if (!attendee) {
      await createAttendee({ userId, eventId })
      return redirect(`/events/${params.eventId}`)
    }
    return null
  }
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
    'aria-controls': `simple-tabpanel-${index}`,
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
      <div style={{ backgroundColor: "rgb(245, 245, 245)", width: "53vw", height: "100vh", position: "absolute" }}>
        <div style={{ margin: "8%" }}>
          <div style={{ display: "flex" }}>
            <Avatar alt="Remy Sharp" src={avatar} sx={{ height: "70px", width: "70px"}} />
            <div style={{ marginLeft: "1rem", marginTop: ".5rem" }}>
              <Typography>Created By</Typography>
              <Typography sx={{ fontWeight: "bold" }}>Lucia Schmitt</Typography>
            </div>
          </div>
          <Typography variant="h3" fontFamily="rasa" sx={{ mt: ".5rem"}}>Sunday Potluck At Luci's</Typography>
{/* ------------------------------------------------------------------------------------------------------ */}
          <Box sx={{ width: '100%', mt: "2rem" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Details" {...a11yProps(0)} />
                <Tab label="Memories" {...a11yProps(1)} />
                <Tab label="Connections" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
            <div>
              <h3>Description:</h3>
              {data.event.description}
              <h3>Address:</h3>
              {data.event.address}
              <h3>Date and Time:</h3>
              {`${dateTime.toDateString()} - ${dateTime.toLocaleTimeString()}`}
              {data.event.userId === data.userId ? (
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
              ) : (<div></div>)}
            </div>
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
  )
}
// <div>
//   <div style={{ display: "inline-flex", width: "110%" }}>
//     <div>
//       <h1>Event Info</h1>
//       <hr/>
//       <h3>Event Title:</h3>
//       {data.event.title}
//       <h3>Description:</h3>
//       {data.event.description}
//       <h3>Address:</h3>
//       {data.event.address}
//       <h3>Date and Time:</h3>
//       {`${dateTime.toDateString()} - ${dateTime.toLocaleTimeString()}`}
//       {data.event.userId === data.userId ? (
//         <div>
//           <Form method="post">
//             <button type="submit" name="_action" value="delete" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
//               Delete
//             </button>
//           </Form>
//           <Link to="updateEvent">
//             <button type="submit" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
//               Update
//             </button>
//           </Link>
//         </div>
//       ) : (<div></div>)}
//     </div>
//     <div style={{ marginLeft: "100px"}}>
//       <h1>Attendees</h1>
//       <hr />
//       <Form method="post">
//         <button type="submit" name="_action" value="create" className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
//           RSVP
//         </button>
//       </Form>
//       <ul>
//         {data.attendees.map((attendee: any) => (
//           <li key={attendee.id}>{attendee.user.email}</li>
//         ))}
//       </ul>
//     </div>
//   </div>
//   <hr />
//   <Outlet/>    
// </div>