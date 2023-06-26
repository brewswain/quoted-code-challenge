"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./firebase";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    // Cleanup the event listener on component unmount
    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    // Handle the loading state while authentication status is being determined
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoggedIn ? (
        <div>Hi, you&apos;re logged in</div>
      ) : (
        router.push("/login")
      )}
    </>
  );
};

export default HomePage;
