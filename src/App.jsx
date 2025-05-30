import React, { useEffect, useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateMeeting from "./pages/CreateMeeting";
import Meeting from "./pages/Meeting";
import MyMeeting from "./pages/MyMeeting";
import OneOnOneMeeting from "./pages/OneOnOneMeeting";
import VideoConferences from "./pages/VideoConferences";
import JoinMeeting from "./pages/JoinMeeting";
// import { MeetingProvider } from "@videosdk.live/react-sdk";
// import { generateToken } from "./utils/videoSdkToken.js";

function App() {
  // const [token, setToken] = useState(null);
  // useEffect(() => {
  //   const token = async () => {
  //     const newToken = await generateToken();
  //     setToken(newToken);
  //   };
  //   token();
  // }, []);
  const token=import.meta.env.VITE_VIDEOSDK_TOKEN;
  console.log("VideoSDK Token:", token ? "Present" : "Missing");
  return (
    <Routes>
      <Route path="/" elememnt={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/createmeeting" element={<CreateMeeting />} />
      <Route path="/meeting1on1" element={<OneOnOneMeeting />} />
      <Route path="/videoconference" element={<VideoConferences />} />
      <Route path="/join/:id" element={<JoinMeeting token={token} />} />
      <Route path="/meeting" element={<Meeting />} />
      <Route path="/mymeeting" element={<MyMeeting />} />
    </Routes>
  );
}

export default App;
