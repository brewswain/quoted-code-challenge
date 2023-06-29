import { collection, query, getDocs, onSnapshot } from "firebase/firestore";
import { firestoreDb } from "../..";

export interface Quote {
  uid: string;
  quote: string;
  likes: number;
  created_at: { seconds: number; nanoseconds: number };
  user_name: string;
}
const quotesQuery = query(collection(firestoreDb, "quotes"));
const quotesReference = collection(firestoreDb, "quotes");

export const getAllQuotes = async () => {
  const querySnapshot = await getDocs(quotesQuery);

  let quotes: Quote[] = [];

  await Promise.all(
    querySnapshot.docs.map(async (document) => {
      const docs = document.data();

      quotes.push(docs.quotes);
    })
  );
  return quotes.flat();
};

// Real time collection data
export const getQuotesSubscription = () => {
  return new Promise<Quote[]>((resolve, reject) => {
    let quotes: Quote[] = [];

    const unsubscribe = onSnapshot(quotesReference, (snapshot) => {
      snapshot.docs.forEach((document) => {
        const docs = document.data();
        quotes.push(docs.quotes);
      });

      const flatQuotes = quotes.flat();
      console.log(flatQuotes);
      resolve(flatQuotes);
    });
  });
};