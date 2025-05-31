import React, { useEffect, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, meetingsRef } from "../utils/firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import { getDocs, query, where } from "firebase/firestore";
import MeetingView from "../components/MeetingView";
import moment from "moment";
import useAuth from "../hooks/useAuth";

function JoinMeeting({ token }) {
  useAuth(); // Ensure user is authenticated
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const params = useParams();
                
  console.log("Meeting ID:", params.id);
  console.log("Token in the JoinMeeting component:", token);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      console.log("Auth state changed:", user);
      setUser(user);
      setLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getMeetingData = async () => {
      if (!loaded || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching meeting data for ID:", params?.id);
        
        const firebaseQuery = query(
          meetingsRef,
          where("meetingId", "==", params?.id)
        );
        
        const fetchedMeeting = await getDocs(firebaseQuery); // Changed from getDoc to getDocs
        
        if (!fetchedMeeting.empty) {
          const meetingData = fetchedMeeting.docs[0].data(); // Get first document's data
          console.log("Meeting data:", meetingData);
          
          const isInvited =
            meetingData.meetingType === "1on1"
              ? meetingData.meetingUser[0] === user?.displayName
              : meetingData.meetingUser.find((u) => u.uid === user?.uid);
          
          console.log("Is invited:", isInvited);
          
          if (isInvited) {
            const today = moment().format("YYYY-MM-DD");
            const meetingDate = meetingData.meetingDate;
            
            console.log("Today:", today, "Meeting date:", meetingDate);
            
            if (meetingDate === today) {
              setIsAllowed(true);
            } else if (moment(meetingDate).isBefore(today)) {
              console.log("Meeting date has passed");
              navigate("/createmeeting");
            } else {
              console.log("Meeting is in the future");
              navigate("/dashboard");
            }
          } else {
            console.log("User not invited to this meeting");
            setError("You are not invited to this meeting");
          }
        } else {
          console.log("Meeting not found");
          setError("Meeting not found");
        }
      } catch (err) {
        console.error("Error fetching meeting data:", err);
        setError("Error loading meeting data");
      } finally {
        setLoading(false);
      }
    };

    getMeetingData(); // Moved inside useEffect
  }, [loaded, params.id, user, navigate]);

  const handleJoinClick = () => {
    console.log("Joining meeting in JoinMeeting...");
    setJoined(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading meeting...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  // Not allowed or no token
  if (!isAllowed || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">
          {!token || !isAllowed ? "No token available or not allowed" : "Access denied"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!joined ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl mb-4">Ready to join meeting?</h2>
          <button
            onClick={handleJoinClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Join Meeting
          </button>
        </div>
      ) : (
        <MeetingProvider
          config={{
            meetingId: params?.id,
            micEnabled: true,
            webcamEnabled: true,
            name: user?.displayName || user?.email || "Guest",
             // Add these additional config options
            participantCanToggleSelfWebcam: true,
            participantCanToggleSelfMic: true,
            chatEnabled: true,
            screenShareEnabled: true,
            maxResolution: "hd",
            // Ensure proper initialization
            joinWithoutUserInteraction: false,
          }}
          token={token}
        >
          <MeetingView />
        </MeetingProvider>
      )}
    </div>
  );
}

export default JoinMeeting;
