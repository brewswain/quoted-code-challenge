import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestoreDb } from "../..";
import { Quote } from "../quotes/getQuotes";

export const deleteQuote = async (
  userUid: string,
  quoteUid: string,
  authorUid: string
) => {
  // Remove the quote from the 'quotes' collection
  const quotesDocument = doc(firestoreDb, `quotes/${authorUid}`);
  const quotesSnapshot = await getDoc(quotesDocument);
  const quotesData = quotesSnapshot.data();

  if (quotesData) {
    const updatedQuotes = quotesData.quotes.filter(
      (quote: Quote) => quote.uid !== quoteUid
    );

    await setDoc(quotesDocument, { quotes: updatedQuotes });
  } else {
    console.error("Quote not found");
  }

  // Remove the quote from the user's 'quotes' array in their document.
  // Depending on time we may restructure our user model to no longer have
  // its own quotes array within it, this was simply an artifact of an early data-shape concept
  const userDocument = doc(firestoreDb, `users/${userUid}`);
  const userSnapshot = await getDoc(userDocument);
  const userData = userSnapshot.data();

  if (userData) {
    const updatedUserQuotes = userData.quotes.filter(
      (quote: Quote) => quote.uid !== quoteUid
    );

    await setDoc(userDocument, { ...userData, quotes: updatedUserQuotes });
  } else {
    console.error("User document not found");
  }
};
