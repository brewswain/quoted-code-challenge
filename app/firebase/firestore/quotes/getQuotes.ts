import { collection, onSnapshot } from "firebase/firestore";
import { firestoreDb } from "../..";

export interface LikedQuote {
  quoteUid: string;
  authorUid: string;
  userUid: string;
}
export interface Quote {
  uid: string;
  quote: string;
  likes: LikedQuote[];
  created_at: { seconds: number; nanoseconds: number };
  user_name: string;
  // Not set to optional here since a placeholder is chosen if the potential user doesn't register with their own picture
  profile_picture: string;
  author: string;
  author_uid: string;
}
const quotesReference = collection(firestoreDb, "quotes");

export const getQuotesSubscription = (callback: (quotes: Quote[]) => void) => {
  let quotes: Quote[] = [];

  const unsubscribe = onSnapshot(quotesReference, (snapshot) => {
    quotes = snapshot.docs.map((document) => document.data().quotes);
    const flatQuotes = quotes.flat();

    // Sort the quotes based on the 'created_at' timestamp in descending order
    const sortedQuotes = flatQuotes.sort(
      (a, b) => b.created_at.seconds - a.created_at.seconds
    );

    callback(sortedQuotes);
  });

  return unsubscribe;
};
