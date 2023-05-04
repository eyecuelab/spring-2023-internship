import { Link, useLoaderData } from "@remix-run/react";
import { getEventsByUserId } from "~/models/events.server";
import { json } from "@remix-run/node";
import { useUser } from "~/utils/utils";

import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/services/session.server";
import Appbar from "~/components/Appbar";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  ListItem,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import {
  CelebrationOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const events = await getEventsByUserId(userId);

  return json({ events });
};

export default function EventsRoute() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <Box>
      <Appbar />
      <Box
        style={{
          backgroundColor: "white",
          width: "53%",
          height: "100vh",
          position: "static",
          display: "flex",
        }}
      >
        <Paper
          sx={{
            width: 200,
            maxWidth: "100%",
            mt: "5%",
            backgroundColor: "rgb(245, 245, 245)",
          }}
        >
          <MenuList>
            <Typography
              sx={{
                fontFamily: "rasa",
                fontWeight: "bold",
                textTransform: "capitalize",
                ml: 1,
              }}
              color="black"
              variant="h6"
            >
              Hello, {user.displayName}
            </Typography>
            <Divider />

            <MenuItem sx={{ py: 2 }}>
              <ListItemIcon>
                <CelebrationOutlined fontSize="medium" />
              </ListItemIcon>
              <Link to="/events">
                <Button
                  sx={{
                    fontFamily: "rasa",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    fontSize: "large",
                  }}
                  color="primary"
                >
                  Your Events
                </Button>
              </Link>
            </MenuItem>

            <MenuItem sx={{ py: 2 }}>
              <ListItemIcon>
                <CalendarMonthOutlined fontSize="medium" />
              </ListItemIcon>
              <Link to="">
                <Button
                  sx={{
                    fontFamily: "rasa",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    fontSize: "large",
                  }}
                  color="primary"
                  disabled
                >
                  Attending Events
                </Button>
              </Link>
            </MenuItem>
            <ul>
              <li>Work in progress</li>
            </ul>
            <MenuItem sx={{ py: 2 }}>
              <ListItemIcon>
                <AddOutlinedIcon fontSize="medium" />
              </ListItemIcon>
              <Link to="new">
                <Button
                  sx={{
                    fontFamily: "rasa",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    fontSize: "large",
                  }}
                  color="primary"
                >
                  Create New Event
                </Button>
              </Link>
            </MenuItem>
          </MenuList>
        </Paper>
        <Box
          style={{
            margin: "8%",
            right: "0%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontFamily: "rasa",
              fontWeight: "bold",
              textTransform: "capitalize",
              fontSize: "large",
              alignSelf: "center",
            }}
            color="black"
            variant="body2"
          >
            Select an event to view the details!
          </Typography>

          {data.events.map((event) => (
            <ListItem key={event.id}>
              <Card
                sx={{
                  minWidth: 200,
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Link prefetch="intent" to={`/${event.id}`}>
                    {event.name}
                  </Link>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </Box>
      </Box>
      {/* <ul>
        {data.attendingEvents.map((attendee) => (
          <li key={attendee.event.id}>
          <Link prefetch="intent" to={`/${attendee.event.id}`}>
              {attendee.event.title}
              </Link>
          </li>
          ))}
      </ul> */}
    </Box>
  );
}
