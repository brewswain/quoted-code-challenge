import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestoreDb } from "../..";
import { Quote } from "../quotes/getQuotes";

export const removeLike = async (
  userUid: string,
  quoteUid: string,
  authorUid: string
) => {
  const quotesDocument = doc(firestoreDb, `quotes/${authorUid}`);
  const quotesSnapshot = await getDoc(quotesDocument);
  const quotesData = quotesSnapshot.data();

  const targetQuote: Quote | undefined = quotesData?.quotes.find(
    (quote: Quote) => quote.uid === quoteUid
  );

  if (targetQuote) {
    const likeIndex = targetQuote.likes.indexOf(userUid);
    if (likeIndex !== -1) {
      targetQuote.likes.splice(likeIndex, 1);

      await updateDoc(quotesDocument, {
        quotes: quotesData?.quotes,
      });
    }
  } else {
    console.error("Quote not found");
  }
};
