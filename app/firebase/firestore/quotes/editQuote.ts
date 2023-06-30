import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestoreDb } from "../..";
import { Quote } from "../quotes/getQuotes";

export const editQuote = async (
  userUid: string,
  quoteUid: string,
  newQuoteText?: string,
  newAuthor?: string
) => {
  // Update the quote in the 'quotes' collection
  const quotesDocument = doc(firestoreDb, `quotes/${userUid}`);
  const quotesSnapshot = await getDoc(quotesDocument);
  const quotesData = quotesSnapshot.data();

  if (quotesData) {
    const updatedQuotes = quotesData.quotes.map((quote: Quote) => {
      if (quote.uid === quoteUid) {
        return {
          ...quote,
          quote: newQuoteText !== undefined ? newQuoteText : quote.quote,
          author: newAuthor !== undefined ? newAuthor : quote.author,
        };
      }
      return quote;
    });

    await setDoc(quotesDocument, { quotes: updatedQuotes });
  } else {
    console.log("Quote not found");
  }

  // Update the quote in the user's 'quotes' array in their document
  const userDocument = doc(firestoreDb, `users/${userUid}`);
  const userSnapshot = await getDoc(userDocument);
  const userData = userSnapshot.data();

  if (userData) {
    const updatedUserQuotes = userData.quotes.map((quote: Quote) => {
      if (quote.uid === quoteUid) {
        return {
          ...quote,
          quote: newQuoteText !== undefined ? newQuoteText : quote.quote,
          author: newAuthor !== undefined ? newAuthor : quote.author,
        };
      }
      return quote;
    });

    await setDoc(userDocument, { ...userData, quotes: updatedUserQuotes });
  } else {
    console.error("User document not found");
  }
};
