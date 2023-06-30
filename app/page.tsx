"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./firebase";
import RegisterPageSkeleton from "./components/Skeletons/RegisterPageSkeleton";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
      } else if (!currentUser) {
        setIsLoggedIn(false);
      }
    });

    // Cleanup the event listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const delayRedirect = async () => {
      if (isLoggedIn === false) {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
        router.push("/login");
      } else if (isLoggedIn === true) {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
        router.push("/feed");
      }
    };

    if (isLoggedIn !== null) {
      delayRedirect();
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn === null) {
    // Handle the loading state while authentication status is being determined
    return <RegisterPageSkeleton />;
  }

  // We need to return something even if isLoggedIn is true or false.
  // You can display a message or a loader here if needed.
  return <RegisterPageSkeleton />;
};

export default HomePage;
