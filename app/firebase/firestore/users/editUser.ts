import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { firestoreDb } from "../..";
import { Quote } from "../quotes/getQuotes";

interface UserDetails {
  userName: string;
  profilePicture: string;
}

export const editUser = async (uid: string, userDetails: UserDetails) => {
  const { userName, profilePicture } = userDetails;

  const userDocument = doc(firestoreDb, `users/${uid}`);
  const quotesDocument = doc(firestoreDb, `quotes/${uid}`);
  const quotesSnapshot = await getDoc(quotesDocument);
  const quotesData = quotesSnapshot.data();

  const currentQuotesArray: Quote[] = quotesData?.quotes;

  const updatedQuotes = currentQuotesArray.map((quote) => ({
    ...quote,
    user_name: userName,
  }));

  try {
    await updateDoc(quotesDocument, { quotes: updatedQuotes });
    await updateDoc(userDocument, {
      user_name: userName,
      profile_picture: profilePicture,
    });

    return "success";
  } catch (error) {
    console.error(error);
  }
};
