import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";

import { firebaseAuth } from "./index";

const provider = new GoogleAuthProvider();

export const emailAuthentication = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    console.log({ response });
  } catch (error) {
    console.error(error);
  }
};

const popupAuthentication = async () => {
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
