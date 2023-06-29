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
import { addUserToDB } from "./firestore/users/addUser";

const provider = new GoogleAuthProvider();

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

export interface RegistrationPayload {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture?: string;
}
export const emailSignUp = async (registrationPayload: RegistrationPayload) => {
  try {
    const response = await createUserWithEmailAndPassword(
      firebaseAuth,
      registrationPayload.email,
      registrationPayload.password
    );

    await addUserToDB(registrationPayload, response.user.uid);
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
