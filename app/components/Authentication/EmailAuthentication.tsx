"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { emailSignIn } from "@/app/firebase/authentication";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { genericErrorToastNotify } from "@/app/errors";

interface EmailSignInProps {
  email: string;
  password: string;
}

const EmailAuthentication = () => {
  const router = useRouter();

  const [authenticationPayload, setAuthenticationPayload] =
    useState<EmailSignInProps>({
      email: "",
      password: "",
    });
  const [preFetchTriggered, setPrefetchTriggered] = useState<boolean | null>(
    null
  );

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

      const response = await emailSignIn(
        validatedAuthenticationPayload.email,
        validatedAuthenticationPayload.password
      );

      if (response) {
        toast.success("User successfully logged in, redirecting to feed.");
        setAuthenticationPayload({ email: "", password: "" });
        router.push("/feed");
      }
    } catch (error) {
      genericErrorToastNotify();
      console.error(error);
    }
  };

  const handleKeypress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // It triggers by pressing the enter key
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  // Little optimization here; we'll trigger it when user begins to fill in our login info.
  // We only want it to trigger once, so we'll use a conditional approach within a useEffect
  const prefetchFeed = async () => {
    await router.prefetch("/feed");
  };

  useEffect(() => {
    const loginInfoIsFilled =
      authenticationPayload.email.trim() !== "" ||
      authenticationPayload.password.trim() !== "";

    if (preFetchTriggered === null && loginInfoIsFilled) {
      prefetchFeed();
      setPrefetchTriggered(true);
    }
  }, [authenticationPayload, preFetchTriggered]);

  return (
    <div className="flex flex-col items-center m-0 m-auto mt-20 w-[90vw] md:w-[25rem]">
      <h1 className="text-2xl">
        Sign in to{" "}
        <span className="text-[rgb(var(--icon-button-rgb))]">Quoted</span>
      </h1>
      <div className="flex flex-col w-9/12 mt-8">
        <div className="flex-col py-2">
          <label className="flex py-1">Email: </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={authenticationPayload.email}
            className="text-black w-full py-1 rounded pl-2"
          />
        </div>
        <div className="flex-col  py-2">
          <label className="flex py-1">Password: </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={authenticationPayload.password}
            onKeyDown={handleKeypress}
            className={"text-black self-end w-full py-1 rounded pl-2"}
          />
        </div>
      </div>
      <div className="flex items-end justify-center py-4  w-9/12 ">
        <button
          className="bg-green-500 w-full py-2 rounded"
          type="button"
          onClick={() => handleSignIn()}
        >
          Sign In
        </button>
      </div>
      <div className="flex items-end justify-center border border-slate-700 w-9/12 rounded">
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="py-2"
        >
          Create a new Account
        </button>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default EmailAuthentication;
