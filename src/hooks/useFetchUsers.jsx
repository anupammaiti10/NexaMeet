import React from "react";
import { getDocs, where, query } from "firebase/firestore";
import { useAppSelector } from "../redux/hooks";
import { usersRef } from "../utils/firebaseConfig";

function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const uid = useAppSelector((state) => state.auth.userDetails?.uid);
  useEffect(() => {
    const fetchUsers = async () => {
      if (!uid) return; // Ensure uid is available before querying
      // Used to query Firestore documents
      const firestoreQuery = query(usersRef, where("uid", "!=", uid));
      const firestoreDocs = await getDocs(firestoreQuery);
      const firebaseUsers = [];
      firestoreDocs.forEach((doc) => {
        firebaseUsers.push(doc.data());
      });
      setUsers(firebaseUsers);
    };
    fetchUsers();
  }, []);

  return users;
}

export default useFetchUsers;
