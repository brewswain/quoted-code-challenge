"use client";

import { useState, useEffect } from "react";

import { Quote } from "@/app/firebase/firestore/quotes/getQuotes";
import { addLike } from "@/app/firebase/firestore/likes/addLike";
import { removeLike } from "@/app/firebase/firestore/likes/removeLike";

import moment from "moment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import ProfilePictureIcon from "../ProfilePictureIcon/ProfilePictureIcon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { deleteQuote } from "@/app/firebase/firestore/quotes/deleteQuote";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface QuoteCardProps {
  quoteParam: Quote;
  userUid: string;
}
const QuoteCard = ({ quoteParam, userUid }: QuoteCardProps) => {
  const [timeStamp, setTimeStamp] = useState<string>("");
  const {
    quote,
    user_name,
    likes,
    created_at,
    profile_picture,
    author,
    author_uid,
  } = quoteParam;
  // implementation taken from https://mui.com/material-ui/react-menu/
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const router = useRouter();
  const quoteUid = quoteParam.uid;
  const isLiked = likes.includes(userUid);
  const isAuthor = quoteParam.author_uid === userUid;
  const isMenuOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    if (anchorEl) {
      // Removes focus from anchor element since it was causing our edit modal to instantly close
      anchorEl.blur();
    }
    setAnchorEl(null);
  };

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

  const handleDelete = () => {
    deleteQuote(userUid, quoteUid, author_uid);
  };

  const handleLikes = () => {
    if (isLiked) {
      removeLike(userUid, quoteUid, author_uid);
    } else {
      addLike(userUid, quoteUid, author_uid);
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
    <section className="flex flex-col border-b border-slate-600  p-4 mt-[calc(50% - 50vh)] mb-[calc(50% - 50vh)] min-h-[8rem]">
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
        <div className="flex flex-col pl-8 w-[90%]">
          <div className="flex mb-2">
            <p className="text-[0.9rem] text-zinc-400">{timeStamp}</p>
          </div>
          <article id="quote__text-container ">
            <h1 className="item-center text-3xl">{`${quote}`}</h1>

            <p className="pr-4 text-zinc-400 text-xl">- {author} </p>
          </article>
          <footer
            id="quote__footer"
            className="mt-4 flex justify-between w-full pr-4"
          >
            <div onClick={handleLikes}>
              {isLiked ? (
                <FavoriteIcon className="cursor-pointer text-[rgb(var(--icon-button-rgb))]" />
              ) : (
                <FavoriteBorderIcon className="cursor-pointer text-zinc-200 hover:text-[rgb(var(--icon-button-rgb))]" />
              )}
              <span className="pl-2  text-zinc-400">{likes.length}</span>
            </div>
            {isAuthor && (
              <>
                <div onClick={handleClick}>
                  {" "}
                  <SettingsIcon />
                </div>
                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                >
                  <MenuItem>
                    <Link
                      href={{
                        pathname: "/quote/edit",
                        query: {
                          initialQuote: quote,
                          initialAuthor: author,
                          userUid,
                          quoteUid,
                        },
                      }}
                    >
                      <EditIcon />
                       Edit Quote
                    </Link>
                  </MenuItem>

                  <MenuItem onClick={() => handleDelete()}>
                    <DeleteIcon />  Delete Quote
                  </MenuItem>
                </Menu>
              </>
            )}
          </footer>
        </div>
      </div>
    </section>
  );
};

export default QuoteCard;
