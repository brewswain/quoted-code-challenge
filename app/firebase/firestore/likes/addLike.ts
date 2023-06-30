import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestoreDb } from "../..";
import { Quote } from "../quotes/getQuotes";

export const addLike = async (
  userUid: string,
  quoteUid: string,
  authorUid: string
) => {
  const quotesDocument = doc(firestoreDb, `quotes/${authorUid}`);
  const quotesSnapshot = await getDoc(quotesDocument);
  const quotesData = quotesSnapshot.data();

  const targetQuote: Quote = quotesData?.quotes.find(
    (quote: Quote) => quote.uid === quoteUid
  );

  if (targetQuote) {
    targetQuote.likes.push(userUid);

    await updateDoc(quotesDocument, {
      quotes: quotesData?.quotes,
    });
  } else {
    console.error("Quote not found");
  }
};
