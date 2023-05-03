import { Form, Link } from "@remix-run/react";
import { Divider, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import logo from "../../public/img/logo.png";
import { useUser } from "~/utils/utils";

function Appbar() {
  const user = useUser();

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "#404040",
        height: 35,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: "10000",
      }}
    >
      <Link to="/">
        <img
          alt="logo"
          src={logo}
          style={{
            height: "2.5rem",
            width: "6.6rem",
            padding: ".5rem",
          }}
        />
      </Link>
      <Box
        sx={{
          pr: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          href="/events"
          variant="text"
          sx={{
            fontFamily: "rasa",
            textTransform: "capitalize",
            color: "white"
          }}
        >
          <Typography variant="body2" fontFamily="rasa">
            My GeTogethers
          </Typography>
        </Button>

        <Divider
          orientation="vertical"
          style={{
            height: ".8rem",
            alignSelf: "center",
            borderColor: "white",
            padding: 1
          }}
        />

        <Form action="/logout" method="post">
          <Button
            type="submit"
            variant="text"
            sx={{
              fontFamily: "rasa",
              textTransform: "capitalize",
              color: "white",
            }}
          >
            <Typography variant="body2" fontFamily="rasa">
              Logout
            </Typography>
          </Button>
        </Form>

        <IconButton sx={{ p: 0 }}>
          <Avatar
            alt="Remy Sharp"
            src={user.picture !== null ? user.picture : ""}
            sx={{ width: 26, height: 26 }}
          />
        </IconButton>
      </Box>
    </AppBar>
  );
}
export default Appbar;
