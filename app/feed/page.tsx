import NewQuoteButton from "../components/Quotes/NewQuoteButton";
import {
  getAllQuotes,
  getQuotesSubscription,
} from "../firebase/firestore/quotes/getQuotes";
import QuoteCard from "../components/Quotes/QuoteCard";

export const revalidate = 60;

const FeedPage = async () => {
  const response = await getAllQuotes();
  const quotes = await getQuotesSubscription();

  console.log({ quotes });

  quotes.map((quote) => console.log(quote));
  return (
    <div className="h-4 flex flex-col">
      <div className="pb-20">
        {quotes
          ? quotes.map((quote) => (
              <QuoteCard quoteParam={quote} key={quote.uid} />
            ))
          : null}
      </div>
      <NewQuoteButton />
    </div>
  );
};

export default FeedPage;
