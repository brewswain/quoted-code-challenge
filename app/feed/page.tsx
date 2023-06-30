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

export const revalidate = 60;

const FeedPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [uid, setUid] = useState<string>("");

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
    const unsubscribeFromQuotes = getQuotesSubscription((updatedQuotes) => {
      setQuotes(updatedQuotes);
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
        {quotes.map((quote) => (
          <QuoteCard quoteParam={quote} key={quote.uid} userUid={uid} />
        ))}
      </div>
      <NewQuoteButton />
    </div>
  );
};

export default FeedPage;
