"use client";

import { useState, useEffect } from "react";
import NewQuoteButton from "../components/Quotes/NewQuoteButton";
import {
  Quote,
  getQuotesSubscription,
} from "../firebase/firestore/quotes/getQuotes";
import QuoteCard from "../components/Quotes/QuoteCard";

export const revalidate = 60;

const FeedPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    // Tne callback here is responsible for updating our state by calling setQuotes with our
    // updated quotes whenever there's a change in the quotes collection.

    // The interesting thing here is that the callback operates iudependently from our useEffect.
    // This therefore leads to the useEffect being responsible for setting up the initial subscription,
    // and cleaning up if needed, while the callback function within our onSnapshot() call within
    // getQuotesSubscription() is responsible for handling real-time updates. We then use that to
    // update our state, causing UI re-renders.

    // Pretty neat! this is the first time i've used this implementation pattern, so I went a bit
    // deeper into this comment for my benefit in particular.
    const unsubscribe = getQuotesSubscription((updatedQuotes) => {
      setQuotes(updatedQuotes);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="h-4 flex flex-col">
      <div className="pb-20">
        {quotes.map((quote) => (
          <QuoteCard quoteParam={quote} key={quote.uid} />
        ))}
      </div>
      <NewQuoteButton />
    </div>
  );
};

export default FeedPage;
