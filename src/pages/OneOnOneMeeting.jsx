import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import MeetingNameField from "../components/MeetingNameField";
import MeetingUserField from "../components/MeetingUserField";
import useFetchUsers from "../hooks/useFetchUsers";
import DateField from "../components/DateField";
import CreateMeetingButtons from "../components/CreateMeetingButtons";
import { generateMeetingID } from "../utils/generateMeetingID";
import { addDoc } from "firebase/firestore";
import { meetingsRef } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";

function OneOnOneMeeting() {
  useAuth();
  const users = useFetchUsers();
  const navigate = useNavigate();
  const [setUser, setSetUser] = useState([]);
  const [meetingName, setMeetingName] = useState("");
  const [date, setDate] = useState(Date);
  const [showErrors, setShowErrors] = useState({
    meetingName: {
      show: false,
      message: [],
    },
    meetingUser: {
      show: false,
      message: [],
    },
  });
  const validateForm = () => {
    let errors = false;
    let showValidateErrors = { ...showErrors };
    if (!meetingName) {
      showValidateErrors.meetingName.show = true;
      showValidateErrors.meetingName.message.push("Meeting Name is required");
      errors = true;
    } else {
      showValidateErrors.meetingName.show = false;
      showValidateErrors.meetingName.message = [];
    }
    if (!setUser) {
      showValidateErrors.meetingUser.show = true;
      showValidateErrors.meetingUser.message.push("Meeting User is required");
      errors = true;
    } else {
      showValidateErrors.meetingUser.show = false;
      showValidateErrors.meetingUser.message = [];
    }
    setShowErrors(showValidateErrors);
    return errors;
  };
  const createMeeting = async (e) => {
    if (!validateForm) {
      const meetingId = generateMeetingID();
      await addDoc(meetingsRef, {
        meetingId,
        createdBy: userDetails.uid,
        meetingName,
        meetingDate: date,
        meetingType: "1on1",
        meetingUser: setUser,
      });
    }
    navigate("/dashboard");
  };
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex justify-center items-center flex-1 px-4 sm:px-6 lg:px-8">
        <form className="w-full max-w-xl space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <MeetingNameField
            label="Meeting Name"
            placeholder="Enter Meeting Name"
            isInValid={showValidateErrors.meetingName.show}
            error={showValidateErrors.meetingName.message}
            value={value}
            setMeetingName={setMeetingName}
          />
          <MeetingUserField
            label="Put Users to call"
            isInValid={showValidateErrors.meetingUser.show}
            error={showValidateErrors.meetingUser.message}
            placeholder="Select Users"
            options={users}
            onChange={setSetUser}
            selectedOptions={setUser}
          />
          <DateField label="Meeting Date" date={date} setDateValue={setDate} />
          <CreateMeetingButtons createMeeting={createMeeting} />
        </form>
      </div>
    </div>
  );
}

export default OneOnOneMeeting;
