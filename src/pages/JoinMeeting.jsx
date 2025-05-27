import React, { useEffect, useRef, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, meetingsRef } from "../utils/firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, query, where } from "firebase/firestore";
import MeetingView from "../components/MeetingView";

function JoinMeeting() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const joinMeetingRef = useRef();
  const navigate = useNavigate();
  const params = useParams();
  console.log(params.id);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoaded(true);
    });
    return () => unsubscribe();
  });
  useEffect(() => {
    const getMeetingData = async () => {
      if (loaded) {
        const firebaseQuery = await query(
          meetingsRef,
          where("meetingId", "==", params.id)
        );
        const fetchedMeeting = await getDoc(firebaseQuery);
        if (fetchedMeeting) {
          const meetingData = fetchedMeeting.docs.data();
          console.log(meetingData);
          const isInvited =
            meetingData.meetingType === "1on1"
              ? meetingData.meetingUser[0] === user?.name
              : meetingData.meetingUser.find((user) => user.uid === user?.uid);
          if (isInvited) {
            if (meetingData.meetingDate === moment().format("YYYY-MM-DD")) {
              setIsAllowed(true);
            } else if (
              moment(meetingData.meetingDate).isBefore(
                moment.format("YYYY-MM-DD")
              )
            ) {
              navigate("/createmeeting");
            } else {
              navigate("/dashboard");
            }
          }
        }
      }
      getMeetingData();
    };
  }, [loaded, params.id, user?.uid, navigate]);

  const initializeMeeting = async () => {          
    try {
      const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY; // Get from VideoSDK dashboard
      const meetingId = params?.id;
      console.log(meetingId);
      const name = user?.name;

      const config = {
        name: name,
        meetingId: meetingId,
        apiKey: apiKey,

        containerId: joinMeetingRef.current,

        micEnabled: true,
        webcamEnabled: true,
        participantCanToggleSelfWebcam: true,
        participantCanToggleSelfMic: true,

        chatEnabled: true,
        screenShareEnabled: true,
        pollEnabled: true,
        whiteboardEnabled: true,

        permissions: {
          askToJoin: false, // Set true for webinar mode
          toggleParticipantWebcam: true,
          toggleParticipantMic: true,
          removeParticipant: true,
          endMeeting: true,
          drawOnWhiteboard: true,
          toggleWhiteboard: true,
        },

        joinScreen: {
          visible: true, // Show the join screen
          // title: "Daily Standup", // Meeting title
          meetingUrl: window.location.href, // Meeting URL
        },

        // participantLeft: () => {
        //   // Handle participant leaving
        // },
      };

      const meeting = new MeetingProvider(config);
      meeting.on("meeting-joined", () => {
        setJoined(true);
        console.log("Meeting Joined Successfully");
      });

      meeting.on("meeting-left", () => {
        console.log("Meeting Left");
      });
      // Join the meeting
      meeting.join();

      return meeting;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let meetingInstance;

    if (isAllowed && joinMeetingRef.current) {
      const joinMeeting = async () => {
        meetingInstance = await initializeMeeting();
      };
      joinMeeting();
    }

    return () => {
      if (meetingInstance) {
        meetingInstance.leave();
      }
    };
  }, [isAllowed]);

  return isAllowed ? (
    <div ref={joinMeetingRef} className="w-full h-full">
      {<MeetingView meetingId={params.id} />}
    </div>
  ) : null;
}

export default JoinMeeting;
