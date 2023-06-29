"use client";

import { useState, useEffect } from "react";

import { Quote } from "@/app/firebase/firestore/quotes/getQuotes";

import moment from "moment";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/firebase";

interface QuoteCardProps {
  quoteParam: Quote;
}
const QuoteCard = ({ quoteParam }: QuoteCardProps) => {
  const [timeStamp, setTimeStamp] = useState<string>("");
  const [user, setUser] = useState();
  const { quote, user_name, likes, created_at } = quoteParam;

  // cloning our Date to prevent accidental modification of source
  const calculateTimestamps = () => {
    const createdAtWrapper = moment(created_at.seconds * 1000);
    const messageTimeInMinutes = createdAtWrapper.minute();
    const formattedTimestamp = createdAtWrapper.format(
      "ddd, MMM Do YYYY - h:mm A"
    );
    const currentTimeInMinutes = moment().minute();
    const timeSinceLastMessage = currentTimeInMinutes - messageTimeInMinutes;

    switch (true) {
      case timeSinceLastMessage === 0:
        setTimeStamp("Sent just now");
        break;
      case timeSinceLastMessage === 1:
        setTimeStamp("1 minute ago");
        break;
      case timeSinceLastMessage > 1 && timeSinceLastMessage <= 5:
        setTimeStamp(`${timeSinceLastMessage} minutes ago`);
        break;
      default:
        setTimeStamp(formattedTimestamp);
    }
  };

  useEffect(() => {
    calculateTimestamps();
    // Ensures we instantly load up timestamps then checks every minute
    setInterval(() => {
      calculateTimestamps();
    }, 60000);
  }, [timeStamp]);

  return (
    <div className="flex flex-col border-b border-[#6a6a6a] p-4 mt-[calc(50% - 50vh)] mb-[calc(50% - 50vh)]">
      <h2 className="item-center">{quote}</h2>
      <p>- {user_name}</p>
      <p>{timeStamp}</p>
      {/* {user_name === } */}
    </div>
  );
};

export default QuoteCard;
