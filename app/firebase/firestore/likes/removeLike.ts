// removeLike.ts

import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestoreDb } from "../..";
import { Quote } from "../quotes/getQuotes";

const removeUserLikedQuote = async (userUid: string, likedQuote: any) => {
  const userDocument = doc(firestoreDb, `users/${userUid}`);
  await updateDoc(userDocument, {
    likedQuotes: arrayRemove(likedQuote),
  });
};

export const removeLike = async (
  userUid: string,
  quoteUid: string,
  authorUid: string
) => {
  const quotesDocument = doc(firestoreDb, `quotes/${authorUid}`);
  const quotesSnapshot = await getDoc(quotesDocument);
  const quotesData = quotesSnapshot.data();

  if (quotesData && quotesData.quotes) {
    const targetQuote = quotesData.quotes.find(
      (quote: Quote) => quote.uid === quoteUid
    );

    if (targetQuote) {
      const likedQuote = {
        quoteUid: quoteUid,
        authorUid: authorUid,
        userUid,
      };
      targetQuote.likes = targetQuote.likes.filter(
        (like: any) =>
          like.quoteUid !== likedQuote.quoteUid ||
          like.authorUid !== likedQuote.authorUid ||
          like.userUid !== likedQuote.userUid
      );

      await updateDoc(quotesDocument, {
        quotes: quotesData.quotes,
      });
      await removeUserLikedQuote(userUid, likedQuote);
    } else {
      console.error("Quote not found");
    }
  }
};
