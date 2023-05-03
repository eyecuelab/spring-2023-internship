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
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import {
  ContentCut,
  ContentCopy,
  ContentPaste,
  Cloud,
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
      {/* <Drawer
        hideBackdrop
        variant="permanent"
        PaperProps={{
          sx: {
            position: "",
            backgroundColor: "rgba(239, 239, 239, 1)",
            left: "0%",
            width: "15%",
            top: "35px",
          },
        }}
        anchor={"left"}
        open={true}
      > */}
      {/* </Drawer> */}

      <Box
        style={{
          backgroundColor: "white",
          width: "53%",
          height: "100vh",
          position: "static",
          display: "flex",
        }}
      >
        <Paper sx={{ width: 200, maxWidth: "100%", mt: "5%" }}>
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
              <Typography
                sx={{
                  fontFamily: "rasa",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  fontSize: "large",
                }}
                color="primary"
              >
                Your Events
              </Typography>
            </MenuItem>

            <MenuItem sx={{ py: 2 }}>
              <ListItemIcon>
                <CalendarMonthOutlined fontSize="medium" />
              </ListItemIcon>
              <Typography
                sx={{
                  fontFamily: "rasa",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  fontSize: "large",
                }}
                color="primary"
              >
                Attending Events
              </Typography>
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
            justifyContent: "flex-start",
            alignItems: "flex-start"
          }}
        >
          <Typography
            sx={{
              fontFamily: "rasa",
              fontWeight: "bold",
              textTransform: "capitalize",
              fontSize: "large",
            }}
            color="black"
            variant="body2"
          >
            Select an event to view the details!
          </Typography>
          <ul>
            {data.events.map((event) => (
              <ListItem key={event.id}>
                <Card sx={{ minWidth: 275, textAlign: "center" }}>
                  <CardContent>
                    <Link prefetch="intent" to={`/${event.id}`}>
                      {event.name}
                    </Link>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </ul>
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
