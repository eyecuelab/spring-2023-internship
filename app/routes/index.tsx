import { Link } from "@remix-run/react";
import { Typography, Button, Box, Tabs, Tab } from "@mui/material";
import React from "react";

import BlackLogo from "~/images/black-logo.png";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Index() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div style={{ backgroundColor: "white", width: "53%", height: "100vh", position: "absolute" }}>
      <div style={{ marginTop: "25%", marginLeft: "15%", marginRight: "22%"}}>
        <img src={BlackLogo} style={{ height: "40px"}} alt="Black logo." />
        <Typography variant="h3" fontFamily="rasa" sx={{ marginTop: "0", marginBottom: "1rem", fontSize: "43px" }}>You Are Invited!</Typography>
        <Typography sx={{ fontSize: "13px", lineHeight: "1.4rem" }}>Are You Tired Of Endless Group Chats, Missed Messages And Forgotten Details When It Comes To Planning Events With Your Loved Ones? Well, Say Hello To Getogether - The Exclusive App Designed To Help You Plan And Organize Your Next Gathering Effortlessly! Whether You're Throwing A Potluck, A Wedding, Or Simply Planning A Weekend Getaway, Getogether Is Here To Help You Create Lists, Share Memories, And Kepp All The Important Discussions In One Convenient Place.</Typography>
        <Typography sx={{ fontSize: "13px", marginTop: "2rem", marginBottom: "3rem" }}>Start Planning Your Next Unforgettable Event With Ease!</Typography>
        <Button variant="outlined" color="primary" href="/login">Signup/Login</Button>
        <hr />
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Item Two" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
          </Box>
      </div>
    </div>
  );
}
