import React, { useEffect, useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";

function MeetingView() {
  const {
    join,
    participants,
    localParticipant,
    toggleMic,
    toggleWebcam,
    meetingId,
  } = useMeeting({
    onMeetingJoined: () => {
      console.log("Meeting joined successfully");
      setJoined(true);
    },
    onMeetingLeft: () => {
      console.log("Meeting left");
    },
    onParticipantJoined: (participant) => {
      console.log("Participant joined:", participant);
    },
    onParticipantLeft: (participant) => {
      console.log("Participant left:", participant);
    },
    onError: (error) => {
      console.error("Meeting error:", error);
      setError(error.message);
    },
  });

  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);
  const [mediaPermissions, setMediaPermissions] = useState({
    camera: false,
    microphone: false,
  });

  // Request media permissions first
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setMediaPermissions({
          camera: true,
          microphone: true,
        });

        // Stop the test stream
        stream.getTracks().forEach((track) => track.stop());

        console.log("Media permissions granted");
      } catch (err) {
        console.error("Media permission denied:", err);
        setMediaPermissions({
          camera: err.name !== "NotAllowedError",
          microphone: err.name !== "NotAllowedError",
        });
      }
    };

    requestPermissions();
  }, []);

  // Join meeting after permissions are granted
  useEffect(() => {
    if (mediaPermissions.camera && mediaPermissions.microphone) {
      const joinMeeting = async () => {
        try {
          console.log("Joining meeting with ID:", meetingId);
          await join();
          setJoined(true);
        } catch (error) {
          console.error("Failed to join meeting:", error);
          setError(error.message);
        }
      };

      const timer = setTimeout(joinMeeting, 500); // Small delay to ensure everything is ready
      return () => clearTimeout(timer);
    }
  }, [join, mediaPermissions, meetingId]);

  // Enable camera and mic after joining
  useEffect(() => {
    if (joined && localParticipant) {
      const enableMedia = async () => {
        try {
          // Enable webcam
          if (!localParticipant.webcamOn) {
            await toggleWebcam();
            console.log("Webcam enabled");
          }

          // Enable microphone
          if (!localParticipant.micOn) {
            await toggleMic();
            console.log("Microphone enabled");
          }
        } catch (error) {
          console.error("Error enabling media:", error);
        }
      };

      enableMedia();
    }
  }, [joined, localParticipant, toggleWebcam, toggleMic]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!mediaPermissions.camera || !mediaPermissions.microphone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg mb-4">
            Please grant camera and microphone permissions
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Joining meeting in MeetingView...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Meeting Controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-4 bg-gray-800 p-4 rounded-lg">
          <button
            onClick={toggleMic}
            className={`px-4 py-2 rounded ${
              localParticipant?.micOn ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            {localParticipant?.micOn ? "Mute" : "Unmute"}
          </button>
          <button
            onClick={toggleWebcam}
            className={`px-4 py-2 rounded ${
              localParticipant?.webcamOn ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            {localParticipant?.webcamOn ? "Stop Video" : "Start Video"}
          </button>
        </div>
      </div>

      {/* Participants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {localParticipant && (
          <ParticipantView
            key={localParticipant.id}
            participantId={localParticipant.id}
            isLocal
          />
        )}

        {[...participants.keys()].map((participantId) => (
          <ParticipantView key={participantId} participantId={participantId} />
        ))}
      </div>
    </div>
  );
}

export default MeetingView;
