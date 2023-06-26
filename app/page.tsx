"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./firebase";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        console.log({ currentUser });
      } else {
        setIsLoggedIn(false);
      }
    });

    // Cleanup the event listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn === null) {
    // Handle the loading state while authentication status is being determined
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Hi, you&apos;re logged in</div>
    </>
  );
};

export default HomePage;
