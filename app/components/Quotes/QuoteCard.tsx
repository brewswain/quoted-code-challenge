"use client";

import { useState, useEffect } from "react";

import { Quote } from "@/app/firebase/firestore/quotes/getQuotes";

import moment from "moment";

import ProfilePictureIcon from "../ProfilePictureIcon/ProfilePictureIcon";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface QuoteCardProps {
  quoteParam: Quote;
}
const QuoteCard = ({ quoteParam }: QuoteCardProps) => {
  const [timeStamp, setTimeStamp] = useState<string>("");
  const [user, setUser] = useState();
  const { quote, user_name, likes, created_at, profile_picture } = quoteParam;

  // cloning our Date to prevent accidental modification of source
  const calculateTimestamps = () => {
    const createdAtWrapper = moment(created_at.seconds * 1000);
    const messageTimeInMinutes = createdAtWrapper.minute();
    const formattedTimestamp = createdAtWrapper.format("MMM Do ");
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
    <section className="flex flex-col border-b border-[#6a6a6a] p-4 mt-[calc(50% - 50vh)] mb-[calc(50% - 50vh)] min-h-[8rem]">
      {/* Semantic HTML is used a bit more in this component than otherwise since there was initially a bunch of nested divs for layout */}
      <div id="quote__layout-container" className="flex">
        <aside
          id="quote__picture-container"
          className="flex justify-start items-start h-[35px]"
        >
          <ProfilePictureIcon
            name={user_name}
            imageUrl={profile_picture}
            dimensions={35}
          />
        </aside>
        <div className="flex flex-col pl-8 max-w-[90%]">
          <div className="flex mb-2">
            <p className="text-[0.9rem] text-zinc-400">{timeStamp}</p>
          </div>
          <article id="quote__text-container ">
            <h1 className="item-center text-3xl">{`${quote}`}</h1>

            <p className="pr-4 text-zinc-400 text-xl">- {user_name} </p>
            {/* {user_name === } */}
            {/*  */}
          </article>
          <footer
            id="quote__footer"
            className="mt-4 flex justify-start w-full pr-4"
          >
            <FavoriteBorderIcon className="cursor-pointer text-zinc-200 hover:text-[rgb(var(--icon-button-rgb))]" />
            <span className="pl-2  text-zinc-400">{likes}</span>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default QuoteCard;
