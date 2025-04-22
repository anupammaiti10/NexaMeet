import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useAppSelector } from "../redux/hooks";
import { getDocs, query } from "firebase/firestore";
import { meetingsRef } from "../utils/firebaseConfig";
import { Link } from "react-router-dom";
import moment from "moment";
function Meeting() {
  useAuth();
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const [meetings, setMeetings] = useState([]);
  useEffect(() => {
    const fetchedMeetings = async () => {
      try {
        const firestoreQuery = await query(meetingsRef);
        const fetchedMeeting = await getDocs(firestoreQuery);
        if (fetchedMeeting.docs.length) {
          let Meetings = [];
          fetchedMeeting.docs.forEach((meeting) => {
            const data = meeting.data();
            // console.log(data);
            if (data.createdBy === userDetails?.uid) {
              Meetings.push({...data});
            } else {
              const isHere = data.meetingUser.find(
                (user) => user.name === userDetails?.uid
              );
              if (isHere) {
                Meetings.push({...data});
              }
            }
          });
          setMeetings(Meetings);
        }
      } catch (err) {
        console.error("Error fetching meetings: ", err);
      }
    };
    if (userDetails?.uid) {
      fetchedMeetings();
    }
  }, [userDetails?.uid]);

  const getMeetingStatus = (meeting) => {
    const today = moment().format("YYYY-MM-DD");
    if (meeting.meetingDate === today) {
      return (
        <Link
          to={`/join/${meeting.meetingDate}`}
          className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded hover:underline"
        >
          Join Now
        </Link>
      );
    } else if (moment(meeting.meetingDate).isBefore(today)) {
      return (
        <span className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded">
          Ended
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
          Upcoming
        </span>
      );
    }
  };
  const getMeetingLink = (text) => {
    return navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Meeting Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Meeting Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Meeting Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Copy Link
                </th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {meetings.map((meeting, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {meeting.meetingName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 capitalize">
                    {meeting.meetingType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {meeting.meetingDate}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getMeetingStatus(meeting)}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={() =>
                        getMeetingLink(
                          `${import.meta.env.VITE_APP_HOST}/join/${meeting.meetingId}`
                        )
                      }
                    >
                      Copy Link
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Meeting;
