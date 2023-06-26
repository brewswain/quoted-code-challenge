"use client";

import { useState, useEffect, lazy } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginPage from "./login/page";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
    <>{isLoggedIn ? <div>Hi, you&apos;re logged in</div> : <LoginPage />}</>
  );
};

export default HomePage;
