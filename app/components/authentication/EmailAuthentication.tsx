"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { emailSignIn, emailSignUp } from "@/app/firebase/authentication";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { genericErrorToastNotify } from "@/app/errors";

interface EmailSignInProps {
  email: string;
  password: string;
}

const EmailAuthentication = () => {
  // onAuthStateChanged(auth, (currentUser) => {
  //   if (currentUser) {
  //     console.log({ currentUser });
  //   }
  // });

  const [authenticationPayload, setAuthenticationPayload] =
    useState<EmailSignInProps>({
      email: "",
      password: "",
    });

  // When it comes to authentication, I just wanted some light input validation for security purposes.
  // The password field
  const authenticationPayloadSchema = z.object({
    email: z
      .string()
      .min(1, { message: "This field cannot be empty" })
      .email("Please use a valid email"),

    password: z.string().min(8, {
      message: "Please ensure that your password is at least 8 characters long",
    }),
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setAuthenticationPayload({
      ...authenticationPayload,
      [name]: value,
    });
  };

  const handleSignIn = async () => {
    try {
      const validatedAuthenticationPayload = authenticationPayloadSchema.parse(
        authenticationPayload
      );

      await emailSignIn(
        validatedAuthenticationPayload.email,
        validatedAuthenticationPayload.password
      );
    } catch (error) {
      genericErrorToastNotify();
      console.error(error);
    }

    setAuthenticationPayload({ email: "", password: "" });
  };

  const handleSignUp = async () => {
    try {
      const validatedAuthenticationPayload = authenticationPayloadSchema.parse(
        authenticationPayload
      );

      await emailSignUp(
        validatedAuthenticationPayload.email,
        validatedAuthenticationPayload.password
      );
    } catch (error) {
      genericErrorToastNotify();
      console.error(error);
    }

    setAuthenticationPayload({ email: "", password: "" });
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="flex flex-col">
        <label className="flex  py-4 justify-center items-end self-end">
          Email: 
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={authenticationPayload.email}
            className="text-black "
          />
        </label>
        <label className="flex  py-4 justify-center items-end self-end">
          Password: 
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={authenticationPayload.password}
            className={"text-black self-end"}
          />
        </label>
      </div>
      <div className="flex items-end justify-center py-4">
        <button type="button" onClick={() => handleSignIn()} className="px-8">
          Sign In
        </button>
        <button type="button" onClick={handleSignUp}>
          Register
        </button>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default EmailAuthentication;
