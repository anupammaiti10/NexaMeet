import React, { useState } from "react";
import MeetingNameField from "./MeetingNameField";
import MeetingUserField from "./MeetingUserField";
import CreateMeetingButtons from "./CreateMeetingButtons";
import { updateDoc, doc } from "firebase/firestore";
import useFetchUsers from "../hooks/useFetchUsers";
import { meetingsRef } from "../utils/firebaseConfig";
import DateField from "./DateField";
function OpenEditLayout({ meeting }) {
  const users = useFetchUsers();
  const [meetingName, setMeetingName] = useState(meeting.meetingName);
  const [updateDate, setUpdateDate] = useState(meeting.meetingDate);
  const [meetingType, setMeetingType] = useState(meeting.meetingType);
  const [selectedUser, setSelectedUser] = useState(meeting.meetingUser);
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
  const editMeeting = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!showErrors.meetingName.show && !showErrors.meetingUser.show) {
      const meetingData = {
        ...meeting,
        meetingName: meetingName,
        meetingDate: updateDate,
        meetingUser: selectedUser,
      };
      await updateDoc(doc(meetingsRef, meeting.meetingId), meetingData);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-md h-full bg-white p-6 shadow-xl overflow-y-auto">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold">{meeting.meetingName}</h2>
        </div>
        <form className="space-y-4">
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
            isMultiUser={meetingType === "1on1" ? false : true}
          />
          <DateField
            label="Meeting Date"
            date={updateDate}
            setDateValue={setUpdateDate}
          />

          <div className="pt-4">
            <CreateMeetingButtons createMeeting={editMeeting} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default OpenEditLayout;
