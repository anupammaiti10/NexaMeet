import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import MeetingNameField from "../components/MeetingNameField";
import MeetingUserField from "../components/MeetingUserField";
import useFetchUsers from "../hooks/useFetchUsers";
import DateField from "../components/DateField";
import CreateMeetingButtons from "../components/CreateMeetingButtons";
import { generateMeetingID } from "../utils/generateMeetingID";
import { addDoc } from "firebase/firestore";
import moment from "moment";
import { meetingsRef } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

function OneOnOneMeeting() {
  useAuth();
  const users = useFetchUsers();
  // console.log(users);
  const { userDetails } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState([]);
  const [meetingName, setMeetingName] = useState("");
  const [date, setDate] = useState(new Date());
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
    if (!selectedUser) {
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
    e.preventDefault();
    if (!validateForm()) {
      const meetingId = generateMeetingID();
      await addDoc(meetingsRef, {
        meetingId,
        createdBy: userDetails.uid,
        meetingName,
        meetingDate: moment(date).format("YYYY-MM-DD"),
        meetingType: "1on1",
        meetingUser: selectedUser,
      });
      navigate("/dashboard");
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex justify-center items-center flex-1 px-4 sm:px-6 lg:px-8">
        <form className="w-full max-w-xl space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <MeetingNameField
            label="Meeting Name"
            placeholder="Enter Meeting Name"
            isInValid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
            value={meetingName}
            setMeetingName={setMeetingName}
          />
          <MeetingUserField
            label="Put Users to call"
            isInValid={showErrors.meetingUser.show}
            error={showErrors.meetingUser.message}
            placeholder="Select Users"
            options={users}
            onChange={setSelectedUser}
            selectedOptions={selectedUser}
            isMultiUser={false}
          />
          <DateField label="Meeting Date" date={date} setDateValue={setDate} />
          <CreateMeetingButtons createMeeting={createMeeting} />
        </form>
      </div>
    </div>
  );
}

export default OneOnOneMeeting;
