import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";

import { firebaseAuth } from "./index";
import { genericErrorToastNotify } from "../errors";

const provider = new GoogleAuthProvider();

export const emailSignIn = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    console.log({ response });
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
    console.log({ response });
  } catch (error) {
    genericErrorToastNotify();
  }
};

const popupSignIn = async () => {
  try {
    const response = await signInWithPopup(firebaseAuth, provider);
  } catch (error) {
    console.error(error);
  }
};

// For mobiles
const redirectAuthentication = async () => {
  try {
    const response = await signInWithRedirect(firebaseAuth, provider);
  } catch (error) {
    console.error(error);
  }
};
