import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function CreateMeeting() {
  useAuth();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* <Header /> */}
        <div className="flex justify-center items-center gap-8 m-10">
          <div
            onClick={() => navigate("/meeting1on1")}
            className="bg-black rounded-xl shadow-lg p-6 w-80 cursor-pointer hover:shadow-xl transition"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZuX7nfQ0c0jjLxTgljmAqDVitZWQlQLfsYg&s"
              alt="icon"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">
              Create 1 on 1 Meeting
            </h2>
            <p className="text-gray-600">
              Create a personal single person meeting.
            </p>
          </div>

          <div
            onClick={() => navigate("/videoconference")}
            className="bg-black rounded-xl shadow-lg p-6 w-80 cursor-pointer hover:shadow-xl transition"
          >
            <img
              src="https://cdn.builtin.com/cdn-cgi/image/f=auto,fit=cover,w=320,h=200,q=80/https://builtin.com/sites/www.builtin.com/files/video-conferencing-software.jpg"
              alt="icon"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">
              Create Video Conference
            </h2>
            <p className="text-gray-600">
              Invite multiple persons to the meeting.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateMeeting;
