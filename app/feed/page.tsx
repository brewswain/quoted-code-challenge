"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { firebaseSignOut } from "../firebase/authentication";
import { getUserFromDB } from "../firebase/firestore/getUser";

import AddCommentIcon from "@mui/icons-material/AddComment";
import { IconButton } from "@mui/material";

const FeedPage = () => {
  const [isNewAccount, setIsNewAccount] = useState<boolean | null>(null);

  const getCurrentUser = onAuthStateChanged(
    firebaseAuth,
    async (currentUser) => {
      if (currentUser) {
        try {
          const user = await getUserFromDB(currentUser.uid);
          return user;
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("user not detected");
      }
    }
  );

  getCurrentUser();

  return (
    <div className="h-screen">
      Feed Page
      <button onClick={() => firebaseSignOut()}>sign out</button>
      <IconButton
        size="large"
        sx={{
          position: "absolute",
          bottom: "6rem",
          right: "2rem",
          // Prevent hover state from removing background color
          "&:hover": {
            bgcolor: "rgb(var(--icon-button-rgb))",
          },
        }}
        // For some reason, backgroundColor/bgColor while NOT hovered is the only property on sx that reverts once the page loads. everything else works,
        // and it's minor enough that I don't want to waste time delving into this, so I'll just put the style directly here
        style={{
          backgroundColor: "rgb(var(--icon-button-rgb))",
        }}
      >
        <AddCommentIcon fontSize="inherit" className="text-white" />
      </IconButton>
    </div>
  );
};

export default FeedPage;
