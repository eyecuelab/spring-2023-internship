import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import logo from "../../public/img/logo.png";
import { useUser } from "~/utils/utils";
import { Typography } from "@mui/material";


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
      }}
    >
      <img
        alt="user image"
        src={logo}
        style={{
          height: "2.2rem",
          width: "6rem",
          padding: ".5rem",
        }}
      />
      <Box
        sx={{
          pr: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button href="/events" variant="text" sx={{ color: "white" }}>
          <Typography variant="body2" fontFamily="rasa">
            My GeTogethers
          </Typography>
        </Button>

        <form action="/logout" method="post">
          <Button type="submit" variant="text" style={{ color: "white" }}>
            <Typography variant="body2" fontFamily="rasa">
              Logout
            </Typography>
          </Button>
        </form>

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
