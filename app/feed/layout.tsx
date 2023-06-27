import React from "react";
import NavBar from "../components/Authentication/NavBar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { getUserFromDB } from "../firebase/firestore/getUser";

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="feed">
      {children}
      <NavBar />
    </div>
  );
};

export default FeedLayout;
