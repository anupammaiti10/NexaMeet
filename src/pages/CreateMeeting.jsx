import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function CreateMeeting() {
  const navigate = useNavigate();
  useAuth();
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex justify-center items-center gap-8 m-10">
        <div
          onClick={() => navigate("/meeting1on1")}
          className="bg-white rounded-xl shadow-lg p-6 w-80 cursor-pointer hover:shadow-xl transition"
        >
          <img
            src={meeting1}
            alt="icon"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Create 1 on 1 Meeting</h2>
          <p className="text-gray-600">
            Create a personal single person meeting.
          </p>
        </div>

        <div
          onClick={() => navigate("/videoconference")}
          className="bg-white rounded-xl shadow-lg p-6 w-80 cursor-pointer hover:shadow-xl transition"
        >
          <img
            src={meeting2}
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
  );
}

export default CreateMeeting;
