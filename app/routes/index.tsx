import { Link } from "@remix-run/react";
import { Box } from "@mui/material";

export default function Index() {
  return (
    <div className="index">
      <h1>You are Invited!</h1>
      <Box>
        Are you tired of endless group chats, missed messages and forgotten
        details when it comes to planning events with your loved ones? Well, say
        hello to Getogether - the exclusive app designed to help you plan and
        organize your next gathering effortlessly! Whether you're throwing a
        potluck, a wedding, or simply planning a weekend getaway, Getogether is
        here to help you create lists, share memories, and keep all the
        important discussions in one convenient place. start planning your next
        unforgettable event with ease!
      </Box>
      <Link to='/login'>Login/Register</Link>
    </div>
  );
}
