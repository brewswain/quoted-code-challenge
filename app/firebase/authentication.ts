import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

import { firebaseAuth } from "./index";
import { genericErrorToastNotify, signOutErrorToastNotify } from "../errors";
import { addUserToDB } from "./firestore/addUser";

const provider = new GoogleAuthProvider();

// addUserToDB is used here to ensure that our user has the same UID both within firebase's authentication system, and our firestore db.
export const emailSignIn = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return response;
  } catch (error) {
    console.error("error");
    genericErrorToastNotify();
    return error;
  }
};

export const emailSignUp = async (email: string, password: string) => {
  try {
    const response = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    await addUserToDB(email, response.user.uid);
    return response;
  } catch (error) {
    genericErrorToastNotify();
  }
};

export const popupSignIn = async () => {
  try {
    const response = await signInWithPopup(firebaseAuth, provider);
  } catch (error) {
    console.error(error);
  }
};

// For mobiles
export const redirectAuthentication = async () => {
  try {
    const response = await signInWithRedirect(firebaseAuth, provider);
  } catch (error) {
    console.error(error);
  }
};

export const firebaseSignOut = async () => {
  try {
    signOut(firebaseAuth);
  } catch (error) {
    signOutErrorToastNotify();
  }
};
