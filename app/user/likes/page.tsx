"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Quote,
  getQuotesSubscription,
} from "@/app/firebase/firestore/quotes/getQuotes";
import { useRouter } from "next/navigation";
import QuoteCard from "@/app/components/Quotes/QuoteCard";
import QuoteCardSkeleton from "@/app/components/Skeletons/QuoteCardSkeleton";
import Image from "next/image";

const LikesPage = () => {
  const [likedQuotes, setLikedQuotes] = useState<Quote[] | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const userUid = searchParams.get("userUid");

  const filterLikedQuotes = (userUid: string, quotes: Quote[]): Quote[] => {
    // Filter the quotes array to find the ones that match the user's likedQuotes
    return quotes.filter((quote: Quote) => {
      return quote.likes.some((like) => like.userUid === userUid);
    });
  };

  useEffect(() => {
    setLoading(true);

    const unsubscribeFromQuotes = getQuotesSubscription((updatedQuotes) => {
      setQuotes(updatedQuotes);
      setLoading(false);
    });

    return () => {
      unsubscribeFromQuotes();
    };
  }, []);

  useEffect(() => {
    if (userUid && quotes.length > 0) {
      const filteredLikedQuotes = filterLikedQuotes(userUid, quotes);
      setLikedQuotes(filteredLikedQuotes);
      console.log({ quotes, likedQuotes });
    }
  }, [userUid, quotes]);

  return (
    <div className="h-4 flex flex-col  md:items-center">
      <div className="md:w-[30vw]">
        <div className="pb-20">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div className="pl-8" key={index}>
                <QuoteCardSkeleton />
              </div>
            ))
          ) : likedQuotes && likedQuotes.length === 0 ? (
            <div className="flex items-center h-[calc(100vh-5rem)] justify-center flex-col ">
              <p className="w-9/12 pb-8">
                No liked quotes found :( Go back and like a couple quotes!
              </p>
              <Image
                src="https://i.redd.it/urtqrwgb0qya1.jpg"
                alt="A picture of kirby looking surprised"
                height={250}
                width={250}
              />
            </div>
          ) : (
            likedQuotes &&
            likedQuotes.map((quote) => (
              <QuoteCard
                quoteParam={quote}
                key={quote.uid}
                userUid={userUid!}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesPage;
