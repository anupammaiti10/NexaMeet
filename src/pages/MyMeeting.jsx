import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import moment from "moment";
import { getDocs, query, where } from "firebase/firestore";
import { meetingsRef } from "../utils/firebaseConfig";
import { useAppSelector } from "../redux/hooks";
import OpenEditLayout from "../components/OpenEditLayout.jsx";
import { Link } from "react-router-dom";

function MyMeeting() {
  useAuth();
  const [meetings, setMeetings] = useState([]);
  const [showEditLayout, setShowEditLayout] = useState(false);
  const [editMeeting, setEditMeeting] = useState(null);
  const userDetails = useAppSelector((state) => state.auth.userDetails);

  const getMyMeeting = useCallback(async () => {
    try {
      const firestoreQuery = await query(
        meetingsRef,
        where("createdBy", "==", userDetails.uid)
      );
      const fetchedMeeting = await getDocs(firestoreQuery);
      if (fetchedMeeting.docs.length) {
        const myMeetings = [];
        fetchedMeeting.docs.forEach((meeting) => {
          const oneMeeting = meeting.data();
          myMeetings.push({
            id: oneMeeting.meetingId,
            ...oneMeeting,
          });
        });
        console.log(meetings[0]);
        setMeetings(myMeetings);
      }
    } catch (err) {
      console.error("Error fetching MyMeetings: ", err);
    }
  }, [userDetails?.uid]);
  useEffect(() => {
    if (userDetails?.uid) {
      getMyMeeting();
    }
  }, [getMyMeeting, userDetails?.uid]);
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
                const isToday =
                  meeting.meetingDate === moment().format("YYYY-MM-DD");
                const isFuture = moment(meeting.meetingDate).isAfter(
                  moment().format("YYYY-MM-DD")
                );
                const isPast = moment(meeting.meetingDate).isBefore(
                  moment().format("YYYY-MM-DD")
                );
                let findingDate = null;
                if (isToday) {
                  findingDate = (
                    <Link
                      to={`/join/${meeting.meetingId}`}
                      className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded hover:underline"
                    >
                      Join Now
                    </Link>
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
                        onClick={() => {
                          setShowEditLayout(true);
                          setEditMeeting(meeting);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${import.meta.env.VITE_APP_HOST}/meeting/:${
                              meeting.id
                            }`
                          )
                        }
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {showEditLayout && <OpenEditLayout meeting={editMeeting} />}
        </div>
      </div>
    </div>
  );
}

export default MyMeeting;
