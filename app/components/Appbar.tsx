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
    <AppBar position="static" sx={{ bgcolor: "#424242", mb: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box>
            <img alt="logo" src={logo} style={{height: "2rem"}}></img>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button sx={{ my: 1, pl: 5, color: "white", display: "block" }}>
          <span>{`Hi ${user.email}`}</span>
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
          <form action="/logout" method="post" style={{ float: "left", padding: "1rem" }}>
            <button type="submit" className="button">
              Logout
            </button>
          </form>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={avatar} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Appbar;
