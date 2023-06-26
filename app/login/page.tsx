import React from "react";
import { firebaseAuth } from "../firebase";
import EmailAuthentication from "../components/authentication/EmailAuthentication";

let loading = false;

const signIn = async () => {
  loading = true;

  try {
  } catch (error) {}
};

const signUp = async () => {};

const LoginPage = () => {
  return (
    <>
      <EmailAuthentication />
    </>
  );
};

export default LoginPage;
