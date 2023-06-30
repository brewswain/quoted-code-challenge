import React from "react";
import NavBar from "@/app/components/Authentication/NavBar";

const LikesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="feed">
      {children}
      <NavBar />
    </div>
  );
};

export default LikesLayout;
