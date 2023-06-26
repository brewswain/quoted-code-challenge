"use client";

import { useState } from "react";
import LoginPage from "./login/page";

const HomePage = () => {
  // TODO: change this into a server component--since we want to use google auth we should be able to do a data fetch to see if user is logged in.
  // That being said, we want non-logged in users to be able to see  the feed, but they need to be logged in to use the app itself
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <>{isLoggedIn ? <div>hi you&rsquo;re logged in</div> : <LoginPage />}</>
  );
};

export default HomePage;
