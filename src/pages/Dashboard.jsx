import React from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const boxStyle = (bg) => ({
    backgroundColor: bg,
    padding: '30px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '20px',
  });
  const navigate = useNavigate();
  // const userInfo=useAppSelector((state)=>state.auth.userInfo);
  // console.log(userInfo);
  return (
    <>
      <div style={{ display: "flex", gap: "20px", padding: "50px" }}>
        <div onClick={() => navigate("/createmeeting")}>CreateMeeting</div>
        <div
          onClick={() => navigate("/meeting")}
          style={boxStyle("lightgreen")}
        >
          Meeting
        </div>
        <div onClick={() => navigate("/mymeeting")} style={boxStyle("plum")}>
          MyMeeting
        </div>
      </div>
    </>
  );
}

export default Dashboard;
