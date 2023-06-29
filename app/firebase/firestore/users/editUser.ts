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

  const currentQuotesArray: Quote[] | undefined = quotesData?.quotes;

  if (currentQuotesArray) {
    const updatedQuotesWithoutProfilePicture = currentQuotesArray.map(
      (quote) => ({
        ...quote,
        user_name: userName,
      })
    );

    const updatedQuotesWithProfilePicture = currentQuotesArray.map((quote) => ({
      ...quote,
      user_name: userName,
      profile_picture: profilePicture,
    }));

    try {
      if (profilePicture) {
        await updateDoc(userDocument, {
          user_name: userName,
          profile_picture: profilePicture,
        });
        await updateDoc(quotesDocument, {
          quotes: updatedQuotesWithProfilePicture,
        });
      } else {
        await updateDoc(userDocument, {
          user_name: userName,
        });
        await updateDoc(quotesDocument, {
          quotes: updatedQuotesWithoutProfilePicture,
        });
      }

      return "success";
    } catch (error) {
      console.error(error);
    }
  }
};
