import { doc, setDoc } from "firebase/firestore";

import { firestoreDb } from "../..";
import { RegistrationPayload } from "../../authentication";

export const addUserToDB = async (
  registrationPayload: RegistrationPayload,
  uid: string
) => {
  const { userName, email, profilePicture } = registrationPayload;

  const userDocument = doc(firestoreDb, `users/${uid}`);
  try {
    const docRef = await setDoc(userDocument, {
      user_name: userName,
      email,
      profile_picture: profilePicture,
    });

    return docRef;
  } catch (error) {
    console.error(error);
  }
};
