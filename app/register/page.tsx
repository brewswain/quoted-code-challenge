"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { emailSignUp } from "@/app/firebase/authentication";
import { ToastContainer, toast } from "react-toastify";
import { genericErrorToastNotify } from "../errors";

import "react-toastify/dist/ReactToastify.css";

interface CustomerDetails {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture?: string;
}

const RegisterPage = () => {
  const [registrationPayload, setRegistrationPayload] =
    useState<CustomerDetails>({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      // Placeholder for now, will give proper placeholder image once profile picture functionality is sorted
      profilePicture:
        "https://cdn.vox-cdn.com/thumbor/9wWAcq-G4SdBYX8_8MSVSx94WkI=/1400x788/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/23761868/Screen_Shot_2022_07_12_at_10.55.30_AM.png",
    });

  const router = useRouter();

  const registrationPayloadSchema = z
    .object({
      userName: z.string().min(1, { message: "This field cannot be empty" }),
      email: z
        .string()
        .min(1, { message: "This field cannot be empty" })
        .email("Please use a valid email"),

      password: z.string().min(8, {
        message:
          "Please ensure that your password is at least 8 characters long",
      }),
      confirmPassword: z.string().min(8, {
        message:
          "Please ensure that your password is at least 8 characters long",
      }),
      profilePicture: z.string().optional(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmPassword"],
        });
        toast(
          "The passwords didn't match, please re-enter them and try again."
        );
      }
    });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    console.log({ name, value });

    setRegistrationPayload({
      ...registrationPayload,
      [name]: value,
    });
  };

  const handleSignUp = async () => {
    try {
      const validatedAuthenticationPayload =
        registrationPayloadSchema.parse(registrationPayload);
      const { userName, email, password, confirmPassword, profilePicture } =
        validatedAuthenticationPayload;

      const response = await emailSignUp(validatedAuthenticationPayload);

      if (response) {
        toast.success("User successfully created, redirecting to feed.");
        setRegistrationPayload({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
          profilePicture: "",
        });
        router.push("/");
      }
    } catch (error) {
      genericErrorToastNotify();
      console.error(error);
    }
  };

  const handleKeypress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // It triggers by pressing the enter key
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  return (
    <div className="flex flex-col items-center w-[90vw] m-0 m-auto mt-20">
      <div className="flex flex-col w-9/12">
        <div className="flex-col py-2">
          <label className="flex py-1">Username: </label>
          <input
            type="string"
            name="userName"
            onChange={handleChange}
            value={registrationPayload.userName}
            className="text-black w-full py-1 rounded"
          />
        </div>
        <div className="flex-col py-2">
          <label className="flex py-1">Email: </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={registrationPayload.email}
            className="text-black w-full py-1 rounded"
          />
        </div>
        <div className="flex-col  py-2">
          <label className="flex py-1">Password: </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={registrationPayload.password}
            onKeyDown={handleKeypress}
            className={"text-black self-end w-full py-1 rounded"}
          />
        </div>
        <div className="flex-col  py-2">
          <label className="flex py-1">Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            value={registrationPayload.confirmPassword}
            onKeyDown={handleKeypress}
            className={"text-black self-end w-full py-1 rounded"}
          />
        </div>
        {/* Just placed here for conceptual layout, will be replaced with a file uploader when file storage is configured*/}
        {/* <div className="flex-col  py-2">
          <label className="flex py-1">Profile Picture: </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={registrationPayload.confirmPassword}
            onKeyDown={handleKeypress}
            className={"text-black self-end w-full py-1 rounded"}
          />
        </div> */}
      </div>

      <div className="flex items-end justify-center py-4  w-9/12 ">
        <button
          className="bg-green-500 w-full py-2 rounded"
          type="button"
          onClick={() => handleSignUp()}
        >
          Sign Up
        </button>
      </div>

      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default RegisterPage;
