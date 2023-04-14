import AppBar from "@mui/material/AppBar";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import logo from "../../public/img/logo.png";
import avatar from "../../public/img/avatar.png";
import { useUser } from "~/utils/utils";

function Appbar() {
  const user = useUser();

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#404040",
        height: 35,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <img alt="logo" src={logo} style={{ 
        height: "1.4rem", 
        width: "6rem",
        padding: ".5rem" 
        }} />
      <Box sx={{ pr: 2}}>
        <Button href="/events" variant="text" sx={{ color: "white" }}>
          <Typography variant="body2" fontFamily="rasa">My GeTogethers</Typography>
        </Button>

        <Button
          variant="text"
          href="/logout"
          style={{ color: "white" }}
        >
          <Typography variant="body2" fontFamily="rasa">Logout</Typography>
        </Button>

        <IconButton sx={{ p: 0 }}>
          <Avatar
            alt="Remy Sharp"
            src={avatar}
            sx={{ width: 26, height: 26 }}
          />
        </IconButton>
      </Box>
    </AppBar>
  );
}
export default Appbar;
