import { Link } from "@remix-run/react";
import { Typography, Button } from "@mui/material";

import BlackLogo from "~/images/black-logo.png";

export default function Index() {
  return (
    <div style={{ backgroundColor: "white", width: "55%", height: "100vh", position: "absolute" }}>
      <div style={{ marginTop: "25%", marginLeft: "15%", marginRight: "24%"}}>
        <img src={BlackLogo} style={{ height: "40px"}} alt="Black logo." />
        <h1 style={{ marginTop: "0", marginBottom: "0", fontFamily: "rasa", fontSize: "43px" }}>You Are Invited!</h1>
        <p style={{ fontFamily: "open sans", fontSize: "13px", lineHeight: "1.4rem" }}>Are You Tired Of Endless Group Chats, Missed Messages And Forgotten Details When It Comes To Planning Events With Your Loved Ones? Well, Say Hello To Getogether - The Exclusive App Designed To Help You Plan And Organize Your Next Gathering Effortlessly! Whether You're Throwing A Potluck, A Wedding, Or Simply Planning A Weekend Getaway, Getogether Is Here To Help You Create Lists, Share Memories, And Kepp All The Important Discussions In One Convenient Place.</p>
        <p style={{ fontFamily: "open sans", fontSize: "13px", marginTop: "2rem", marginBottom: "3rem" }}>Start planning your next unforgettable event with ease!</p>
        <Button variant="outlined" color="primary" href="/login">Singup/Login</Button>
      </div>
    </div>
  );
}