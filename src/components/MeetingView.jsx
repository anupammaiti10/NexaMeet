import React, { useEffect, useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";

function MeetingView() {
  const { join, participants, localParticipant } = useMeeting();
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const joinMeeting = async () => {
      try {
        console.log("Attempting to join meeting...");
        await join();
        setJoined(true);
        console.log("Successfully joined meeting");
      } catch (error) {
        console.error("Failed to join meeting:", error);
      }
    };

    joinMeeting();
  }, [join]);

  console.log('Participants:', participants);
  console.log('Local Participant:', localParticipant);

  if (!joined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Joining meeting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {/* Local participant */}
        {localParticipant && (
          <ParticipantView 
            key={localParticipant.id} 
            participantId={localParticipant.id} 
            isLocal 
          />
        )}
        
        {/* Remote participants */}
        {[...participants.keys()].map((participantId) => (
          <ParticipantView 
            key={participantId} 
            participantId={participantId} 
          />
        ))}
      </div>
    </div>
  );
}

export default MeetingView;
