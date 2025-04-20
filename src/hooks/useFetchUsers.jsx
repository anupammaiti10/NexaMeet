import React, { useEffect, useState } from "react";
import { getDocs, where, query } from "firebase/firestore";
import { useAppSelector } from "../redux/hooks";
import { usersRef } from "../utils/firebaseConfig";
// import { docs } from 'firebase/firestore'; // or similar
function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const uid = useAppSelector((state, uid) => state.auth.userDetails?.uid);
  useEffect(() => {
    const fetchUsers = async () => {
      if (!uid) return; // Ensure uid is available before querying
      // Used to query Firestore documents
      const firestoreQuery = query(usersRef, where("uid", "!=", uid));
      const firestoreDocs = await getDocs(firestoreQuery);
      const firebaseUsers = [];
      firestoreDocs.forEach((user) => {
        firebaseUsers.push({ ...user, label: user.name });
      });
      setUsers(firebaseUsers);
    };
    fetchUsers();
  }, [users, uid]); // Added uid to the dependency array

  return users;
  // users= {
  // "email": "maitianupam567@gmail.com",
  // "name": "Anupam Maiti",
  // "uid": "0f6gUqwHFjXlqU4k1oWctxwdswc2",
  // "label": "Anupam Maiti",
  //  }
}

export default useFetchUsers;
