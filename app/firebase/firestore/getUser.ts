import { getDoc, doc } from "firebase/firestore";
import { firestoreDb } from "..";

export const getUserFromDB = async (uid: string) => {
  const userDocument = doc(firestoreDb, `users/${uid}`);

  const userSnapshot = await getDoc(userDocument);

  if (userSnapshot.exists()) {
    const docData = userSnapshot.data();

    return docData;
  }
};
