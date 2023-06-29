import React from "react";
import NavBar from "../components/Authentication/NavBar";

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="feed">{children}</div>;
};

export default FeedLayout;
