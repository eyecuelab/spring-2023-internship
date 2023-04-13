import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import logo from "../../public/img/logo.png";
import avatar from "../../public/img/avatar.png";
import { useUser } from "~/utils";

function Appbar() {
  const user = useUser();

  return (
    <Box sx={{ flexGrow: 1, display: "flex" }}>
      <AppBar position="static" sx={{ bgcolor: "#404040", mb: 1, height: 45 }}>
        <Container maxWidth="xl" sx={{height: 45, display: "flex"}}>
          <Toolbar disableGutters>
            <Box>
              <img
                alt="logo"
                src={logo}
                style={{ height: "1.4rem", width: "6rem", padding: "0" }}
              ></img>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              <Button
                href="/events"
                variant="text"
                sx={{ pl: 5, color: "white", display: "block" }}
              >
                My GeTogethers
              </Button>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Button
                variant="text"
                href="/logout"
                style={{ float: "left", padding: "1rem", color: "white" }}
              >
                Logout
              </Button>
            </Box>
            <Box>
              <Tooltip title="Open settings">
                <IconButton sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 36, height: 36 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
export default Appbar;
