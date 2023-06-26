"use client";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { firebaseSignOut } from "../firebase/authentication";
import { getUserFromDB } from "../firebase/firestore/getUser";

const FeedPage = () => {
  onAuthStateChanged(firebaseAuth, (currentUser) => {
    console.log({ currentUser });

    if (currentUser) {
      getUserFromDB(currentUser.uid);
    }
  });

  return (
    <div>
      Feed Page
      <button onClick={() => firebaseSignOut()}>sign out</button>
    </div>
  );
};

export default FeedPage;
