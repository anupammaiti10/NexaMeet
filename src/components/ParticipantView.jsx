import React, { useEffect, useRef } from 'react'
import { useParticipant } from "@videosdk.live/react-sdk";

function ParticipantView({ participantId, isLocal = false }) {
  const { webcamStream, micStream, displayName, isActiveSpeaker } = useParticipant(participantId);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Handle webcam stream
  useEffect(() => {
    if (webcamStream && videoRef.current) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      videoRef.current.srcObject = mediaStream;

      // Play the video with better error handling
      const playVideo = async () => {
        try {
          await videoRef.current.play();
          console.log(`Video playing for ${displayName || participantId}`);
        } catch (err) {
          console.error("Video play failed:", err);
          // Retry after a short delay
          setTimeout(() => {
            videoRef.current?.play().catch(console.error);
          }, 1000);
        }
      };

      playVideo();
    }
  }, [webcamStream, displayName, participantId]);

  // Handle mic stream
  useEffect(() => {
    if (micStream && audioRef.current && !isLocal) { // Don't play local audio to avoid feedback
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      audioRef.current.srcObject = mediaStream;
      
      // Play audio
      audioRef.current.play().catch((err) => {
        console.error("Audio play failed:", err);
      });
    }
  }, [micStream, isLocal]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className={`relative rounded-lg overflow-hidden bg-gray-800 min-h-[200px] ${
      isActiveSpeaker ? "ring-4 ring-blue-500" : ""
    }`}>
      {webcamStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Only mute local video to prevent echo
          className="w-full h-full object-cover"
          onLoadedMetadata={() => {
            console.log(`Video metadata loaded for ${displayName || participantId}`);
          }}
          onError={(e) => {
            console.error("Video error:", e);
          }}
        />
      ) : (
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">
              {displayName?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
        </div>
      )}
      
      {/* Audio element - only for remote participants */}
      {!isLocal && (
        <audio 
          ref={audioRef} 
          autoPlay 
          playsInline 
          onError={(e) => {
            console.error("Audio error:", e);
          }}
        />
      )}
      
      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
        <p className="truncate text-sm font-medium">
          {displayName || `Participant ${participantId}`} {isLocal ? "(You)" : ""}
        </p>
        {/* Optional: Add mic/camera status indicators */}
        <div className="flex gap-2 mt-1">
          {!webcamStream && (
            <span className="text-xs bg-red-500 px-2 py-1 rounded">Camera Off</span>
          )}
          {!micStream && (
            <span className="text-xs bg-red-500 px-2 py-1 rounded">Mic Off</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParticipantView;
