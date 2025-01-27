import React from "react";
import animation from "../assets/animation.jpg";
import { firebaseAuth, firebaseDB, usersRef } from "../utils/firebaseConfig";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useAppDispatch } from "../redux/hooks";
                         
function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // onAuthStateChanged(firebaseAuth, (currentUser) => {
  //   if (currentUser) navigate("/");
  // });
  const login = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName, email, uid },
    } = await signInWithPopup(firebaseAuth, provider);
    // console.log(displayName, email, uid);
    if (email) {
      const firestoreQuery = query(usersRef, where("uid", "==", uid));
      const fetchedUser = await getDocs(firestoreQuery);
      if (fetchedUser.docs.length === 0) {
        await addDoc(collection(firebaseDB, "users"), {
          uid,
          name: displayName,
          email,
        });
      }
      dispatch(setUser({ uid, email: email, name: displayName }));
      navigate("/dashboard");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <div className="flex justify-around  bg-gray-900 text-white p-20 border-black rounded-lg shadow-black shadow-lg">
          <div className="flex flex-1 justify-center items-center">
            <div className="grid grid-cols-2 gap-4">
              <img
                src={animation}
                alt="User 1"
                className="w-70 mx-30 h-70 rounded-[20%] border-2 border-white"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center items-center">
            <h1 className="text-5xl font-bold text-blue-500 mb-4">Zoom</h1>
            <p className="text-lg mb-6">
              One Platform to{" "}
              <span className="text-blue-400 font-semibold">connect</span>
            </p>

            <button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded shadow-lg transition hover:underline"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
