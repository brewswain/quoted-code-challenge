"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { firebaseSignOut } from "../firebase/authentication";
import { getUserFromDB } from "../firebase/firestore/getUser";

const FeedPage = () => {
  const [isNewAccount, setIsNewAccount] = useState<boolean | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        if (currentUser) {
          const user = await getUserFromDB(currentUser.uid);

          if (user) {
            if (user.user_name) {
              console.log("not a new account");
              return null;
            } else {
            }
          }
        }
      }
    );
    // Cleanup the event listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      Feed Page
      <button onClick={() => firebaseSignOut()}>sign out</button>
    </div>
  );
};

export default FeedPage;
