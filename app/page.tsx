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
    if (isLoggedIn === false) {
      router.push("/login");
    } else if (isLoggedIn === true) {
      router.push(`/feed`);
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn === null) {
    // Handle the loading state while authentication status is being determined
    return <RegisterPageSkeleton />;
  }

  return;
};

export default HomePage;
