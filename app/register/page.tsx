"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { emailSignUp } from "@/app/firebase/authentication";

import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";

import { genericErrorToastNotify } from "../errors";

import "react-toastify/dist/ReactToastify.css";
import {
  getRandomPlaceholderImage,
  uploadProfilePicture,
} from "../firebase/storage";

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
      profilePicture: "",
    });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

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
      profilePicture: z.any().optional(),
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
    const { name, value, files } = event.target;

    if (name === "profilePicture" && files !== null) {
      const picture = files[0];

      setProfilePicture(picture);
    } else {
      setRegistrationPayload({
        ...registrationPayload,
        [name]: value,
      });
    }
  };

  const handleSignUp = async () => {
    try {
      if (profilePicture !== null) {
        try {
          const response = await uploadProfilePicture(
            profilePicture,
            profilePicture.name + uuid()
          );
          setRegistrationPayload({
            ...registrationPayload,
            profilePicture: response,
          });
        } catch (error) {
          console.error(error);
        }
      }
      const validatedAuthenticationPayload =
        registrationPayloadSchema.parse(registrationPayload);
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
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  useEffect(() => {
    // While I wouldn't normally be too worried about a potential memory leak here since it's a one time API call on mount,
    // the API being from a 3rd party that is usually subscription heavy(firebase) suggests that it pays to be cognizant
    // of the possibility of aforementioned memory leak. Plus cleanup functions tend to be good practise in most cases.
    let componentIsMounted = true;

    const fetchPlaceholder = async () => {
      try {
        const response = await getRandomPlaceholderImage();
        console.log({ response });

        if (componentIsMounted) {
          setRegistrationPayload({
            ...registrationPayload,
            profilePicture: response,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlaceholder();

    return () => {
      componentIsMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-[90vw] m-0 m-auto mt-20">
      <div className="flex flex-col w-9/12">
        <div className="flex-col py-2">
          <label className="flex py-1">
            Username:<span className="text-red-400">*</span>  
          </label>
          <input
            type="string"
            name="userName"
            onChange={handleChange}
            value={registrationPayload.userName}
            className="text-black w-full py-1 rounded"
          />
        </div>
        <div className="flex-col py-2">
          <label className="flex py-1">
            Email:<span className="text-red-400">*</span>  
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={registrationPayload.email}
            className="text-black w-full py-1 rounded"
          />
        </div>
        <div className="flex-col  py-2">
          <label className="flex py-1">
            Password:<span className="text-red-400">*</span>  
          </label>
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
          <label className="flex py-1">
            Confirm Password:<span className="text-red-400">*</span>  
          </label>
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
        <div className="flex-col  py-2">
          <label className="flex py-1">Profile Picture: </label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleChange}
            onKeyDown={handleKeypress}
            className={"text-black self-end w-full py-1 rounded"}
          />
        </div>
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
