import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, meetingsRef } from "../utils/firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, query, where } from "firebase/firestore";
function JoinMeeting() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const joinMeetingRef = useRef();
  const navigate = useNavigate();
  const params = useParams();
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
              ? meetingData.meetingUser[0] === user?.uid
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
  },[]);

  const initializeMeeting = async () => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      process.env.REACT_APP_ZEGOCLOUD_APP_ID,
      process.env.REACT_APP_ZEGOCLOUD_SERVER_SECRET,
      params.id,
      user?.id,
      user?.name
    );
    // Create instance and join room
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: joinMeetingRef.current,
      maxUsers: 50,
      sharedLinks: [
        {
          name: "Personal link",
          url: window.location.href,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };


  return isAllowed ? (
    <div ref={joinMeetingRef} className="w-full h-full"></div>
  ) : null;
}

export default JoinMeeting;
