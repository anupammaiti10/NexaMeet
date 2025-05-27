import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
function MeetingView({ meetingId }) {
  return (
    <div>
      const {participants} = useMeeting(); 
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <ParticipantView participantId={"local"} isLocal />
          {[...participants.keys()].map((participantId) => (
            <ParticipantView key={participantId} participantId={participantId} />
          ))}
        </div>
        );  
    </div>
  );
}

export default MeetingView;
