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
