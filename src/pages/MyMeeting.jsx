import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { query, where } from "firebase/firestore";
import { meetingsRef } from "../utils/firebaseConfig";
import { useAppSelector } from "../redux/hooks";
import openEditLayout from "../components/openEditLayout";

function MyMeeting() {
  useAuth();
  const [meetings, setMeetings] = useState([]);
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const getMyMeeting = useCallback(async () => {
    const firestoreQuery = await query(
      meetingsRef,
      where("createdBy", "==", userDetails.uid)
    );
    const fetchedMeeting = await getDocs(firestoreQuery);
    if (fetchedMeeting.length) {
      const myMeetings = [];
      fetchedMeeting.forEach((meeting) => {
        myMeetings.push({
          id: meeting.meetingId,
          ...meeting.data(),
        });
      });
      setMeetings(myMeetings);
    }
  }, [userDetails?.id]);
  useEffect(() => {
    if (userDetails?.uid) {
      getMyMeeting();
    }
  }, [getMyMeeting]);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center my-4">
        <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-4">
          <table className="w-full table-auto text-sm text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b">Meeting Name</th>
                <th className="p-2 border-b">Meeting Type</th>
                <th className="p-2 border-b">Meeting Date</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b text-center">Edit</th>
                <th className="p-2 border-b text-center">Copy Link</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => {
                const isToday = meeting.meetingDate === moment().format("L");
                const isFuture = moment(meeting.meetingDate).isAfter(
                  moment().format("L")
                );
                const isPast = moment(meeting.meetingDate).isBefore(
                  moment().format("L")
                );
                let findingDate = null;
                if (isToday) {
                  findingDate = (
                    <span className="text-green-500 font-semibold">
                      Join Now
                    </span>
                  );
                } else if (isFuture) {
                  findingDate = (
                    <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                      Upcomming
                    </span>
                  );
                } else {
                  findingDate = (
                    <span className="inline-block bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs">
                      Missed
                    </span>
                  );
                }
                return (
                  <tr key={meeting.id} className="border-t">
                    <td className="p-2">{meeting.meetingName}</td>
                    <td className="p-2">{meeting.meetingType}</td>
                    <td className="p-2">{meeting.meetingDate}</td>
                    <td className="p-2">{findingDate}</td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        className={`text-red-500 hover:text-red-700${
                          isPast ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isPast}
                        onClick={openEditLayout}
                      >
                        Edit ✎
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={navigator.clipboard.writeText(
                          `${process.env.REACT_HOST}/meeting/${meeting.id}`
                        )}
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyMeeting;
