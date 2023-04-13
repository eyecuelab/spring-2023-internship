import { Link } from "@remix-run/react";
import { Typography, Button } from "@mui/material";

import BlackLogo from "~/images/black-logo.png";

export default function Index() {
  return (
    <div style={{ backgroundColor: "white", width: "53%", height: "100vh", position: "absolute" }}>
      <div style={{ marginTop: "25%", marginLeft: "15%", marginRight: "22%"}}>
        <img src={BlackLogo} style={{ height: "40px"}} alt="Black logo." />
        <Typography variant="h3" fontFamily="rasa" sx={{ marginTop: "0", marginBottom: "1rem", fontSize: "43px" }}>You Are Invited!</Typography>
        <Typography sx={{ fontSize: "13px", lineHeight: "1.4rem" }}>Are You Tired Of Endless Group Chats, Missed Messages And Forgotten Details When It Comes To Planning Events With Your Loved Ones? Well, Say Hello To Getogether - The Exclusive App Designed To Help You Plan And Organize Your Next Gathering Effortlessly! Whether You're Throwing A Potluck, A Wedding, Or Simply Planning A Weekend Getaway, Getogether Is Here To Help You Create Lists, Share Memories, And Kepp All The Important Discussions In One Convenient Place.</Typography>
        <Typography sx={{ fontSize: "13px", marginTop: "2rem", marginBottom: "3rem" }}>Start Planning Your Next Unforgettable Event With Ease!</Typography>
        <Button variant="outlined" color="primary" href="/login">Signup/Login</Button>
      </div>
    </div>
  );
}
