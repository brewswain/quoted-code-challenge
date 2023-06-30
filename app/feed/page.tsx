"use client";

import { useState, useEffect } from "react";
import NewQuoteButton from "../components/Quotes/NewQuoteButton";
import {
  Quote,
  getQuotesSubscription,
} from "../firebase/firestore/quotes/getQuotes";
import QuoteCard from "../components/Quotes/QuoteCard";
import { firebaseAuth } from "../firebase";

import { useRouter } from "next/navigation";
import QuoteCardSkeleton from "../components/Skeletons/QuoteCardSkeleton";

export const revalidate = 60;

const FeedPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [uid, setUid] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    // Tne callback here is responsible for updating our state by calling setQuotes with our
    // updated quotes whenever there's a change in the quotes collection.

    // The interesting thing here is that the callback operates independently from our useEffect.
    // This therefore leads to the useEffect being responsible for setting up the initial subscription,
    // and cleaning up if needed, while the callback function within our onSnapshot() call within
    // getQuotesSubscription() is responsible for handling real-time updates. We then use that to
    // update our state, causing UI re-renders.

    // Pretty neat! this is the first time i've used this implementation pattern, so I went a bit
    // deeper into this comment for my benefit in particular.
    setLoading(true);

    const unsubscribeFromQuotes = getQuotesSubscription((updatedQuotes) => {
      setQuotes(updatedQuotes);
      setLoading(false);
    });

    const unsubscribeFromUser = firebaseAuth.onAuthStateChanged(
      async (currentUser) => {
        if (currentUser) {
          setUid(currentUser.uid);
        } else if (!currentUser) {
          console.error("User not found");
          router.push("/login");
        }
      }
    );

    return () => {
      unsubscribeFromQuotes();
      unsubscribeFromUser();
    };
  }, []);

  return (
    <div className="h-4 flex flex-col">
      <div className="pb-20">
        {loading
          ? // _ used here since we don't actually plan to use anyting but our index from this map
            // Also we synthetically assume skeleton amount to signify multiple quotes.

            Array.from({ length: 3 }).map((_, index) => (
              <div className="pl-8">
                <QuoteCardSkeleton key={index} />
              </div>
            ))
          : quotes.map((quote) => (
              <QuoteCard quoteParam={quote} key={quote.uid} userUid={uid} />
            ))}
      </div>
      <NewQuoteButton />
    </div>
  );
};

export default FeedPage;
