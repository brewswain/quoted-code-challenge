import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import moment from "moment";
import { v4 as uuid } from "uuid";

import { firestoreDb } from "../..";
import { Quote } from "./getQuotes";
import { QuotePayload } from "@/app/new/quote/page";

// The goal here is that we add quote data to TWO separate collections; One would be a `quotes` collection that has every quote's UID listed
// so that we can populate our entire feed by simply referencing the quotes collection and searching for each quote by said ID. We can also
// potentially have the physical quote placed there, but i'm not sure if that's worth it from a performance POV.

// The other collection would be us embedding the actual quote plus its metadata such as createdAt, etc inside of our User. This makes it easier to attribute ownership of quotes etc
// This is important because I want to make a "User" page where you can view said user's quotes, plus this lines up better for "liking" functionality later down the pipeline. If we
// didn't plan to use likes and a "show User's Quotes" funcitonality, then placing all information to the separate `quotes` collection would be more logical.
export const addQuote = async (uid: string, quotePayload: QuotePayload) => {
  const timestamp = moment().toDate();

  const userDocument = doc(firestoreDb, `users/${uid}`);
  const quoteUid = uuid();
  const quotesDocument = doc(firestoreDb, `quotes/${uid}`);

  try {
    const userSnapshot = await getDoc(userDocument);

    const userData = userSnapshot.data();
    const quotes = userData?.quotes || [];
    const user_name = userData?.user_name || "";
    const profile_picture = userData?.profile_picture || "";
    const updatedQuotes = [
      ...quotes,
      {
        quote: quotePayload.quote,
        uid: quoteUid,
        // Elected to use moment created timestamp here since firestore doesn't support serverTimestamp() within arrays.
        created_at: timestamp,
        likes: [""],
        user_name,
        profile_picture,
        author: quotePayload.author,
      },
    ];

    await updateDoc(userDocument, { quotes: updatedQuotes });
    // // Potentially, we can reverse our current implementation of quotes collection--instead of  having the collection be `quotes/quoteId/user_id`, it can be something like:
    // // `quotes/user_id/quotes[quoteId1, quoteId2, ...]
    // // For now I value being able to simple get all quotes by referencing the shallow level quoteId though.
    await setDoc(quotesDocument, { quotes: updatedQuotes });
  } catch (error) {
    console.error(error);
  }
};
