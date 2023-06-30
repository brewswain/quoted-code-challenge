import { collection, query, getDocs, onSnapshot } from "firebase/firestore";
import { firestoreDb } from "../..";

export interface Quote {
  uid: string;
  quote: string;
  likes: number;
  created_at: { seconds: number; nanoseconds: number };
  user_name: string;
  // Not set to optional here since a placeholder is chosen if the potential user doesn't register with their own picture
  profile_picture: string;
  author: string;
}
const quotesReference = collection(firestoreDb, "quotes");

// Modifying this method to accept a callback function as a parameter is used to allow us to
// communicate any updated quotes from the subscription to the compenent, which then triggers
// a state update, causing a re-render.
export const getQuotesSubscription = (callback: (quotes: Quote[]) => void) => {
  let quotes: Quote[] = [];

  const unsubscribe = onSnapshot(quotesReference, (snapshot) => {
    quotes = snapshot.docs.map((document) => document.data().quotes);
    const flatQuotes = quotes.flat();
    callback(flatQuotes);
  });

  return unsubscribe;
};
