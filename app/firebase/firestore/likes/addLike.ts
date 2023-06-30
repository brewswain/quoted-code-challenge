import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestoreDb } from "../..";
import { Quote } from "../quotes/getQuotes";

const updateUserLikedQuotes = async (userUid: string, likedQuote: any) => {
  const userDocument = doc(firestoreDb, `users/${userUid}`);
  await updateDoc(userDocument, {
    likedQuotes: arrayUnion({
      quoteUid: likedQuote.quoteUid,
      authorUid: likedQuote.authorUid,
      userUid,
    }),
  });
};

export const addLike = async (
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
      targetQuote.likes.push(likedQuote);

      await updateDoc(quotesDocument, {
        quotes: quotesData.quotes,
      });
      await updateUserLikedQuotes(userUid, likedQuote);
    } else {
      console.error("Quote not found");
    }
  }
};
