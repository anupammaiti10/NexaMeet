import React from "react";
import { useNavigate } from "react-router-dom";

function CreateMeetingButtons({createMeeting}) {
  const navigate= useNavigate();
  return (
    <div className="flex items-center space-x-4 mt-4">
      <button
        type="button"
        onClick={()=>navigate('/createmeeting')}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        onClick={createMeeting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create Meeting
      </button>
    </div>
  );
}

export default CreateMeetingButtons;
