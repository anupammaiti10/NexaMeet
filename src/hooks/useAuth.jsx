import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
// Track Authentication State
function useAuth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) navigate("/login");
      else {
        const { displayName, email, uid } = user;
        dispatch(
          userDetails({
            uid,
            email: email,
            name: displayName,
          })
        );
      }
    });
    return () => unsubscribe();
  }, [navigate]);
}

export default useAuth;
