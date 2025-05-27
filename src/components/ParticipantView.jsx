import React, { useEffect, useRef } from 'react'
import { useParticipant } from "@videosdk.live/react-sdk";
function ParticipantView({participantId,isLocal=false}) {
     const { webcamStream, micStream, displayName, isActiveSpeaker } = useParticipant(participantId);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      videoRef.current.srcObject = mediaStream;
    }
  }, [webcamStream]);

  useEffect(() => {
    if (micStream && audioRef.current) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      audioRef.current.srcObject = mediaStream;
    }
  }, [micStream]);
  return (
    <div className={`relative rounded-lg overflow-hidden ${isActiveSpeaker ? "ring-4 ring-blue-500" : ""}`}>
      {webcamStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-2xl">
              {displayName?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
        </div>
      )}
      <audio ref={audioRef} autoPlay playsInline muted={isLocal} />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <p className="truncate">
          {displayName} {isLocal ? "(You)" : ""}
        </p>
      </div>
    </div>
  )
}

export default ParticipantView
