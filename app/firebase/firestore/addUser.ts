import { addDoc, collection, doc, setDoc } from "firebase/firestore";

import { firestoreDb } from "..";

export const addUserToDB = async (email: string, uid: string) => {
  const userDocument = doc(firestoreDb, `users/${uid}`);
  try {
    const docRef = await setDoc(userDocument, {
      user_name: "brewswain",
      email,
    });
  } catch (error) {
    console.error(error);
  }
};
