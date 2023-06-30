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
import Link from "next/link";
import Image from "next/image";

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
  const [validatedRegistrationPayload, setValidatedRegistrationPayload] =
    useState<CustomerDetails>({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePicture: "",
    });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState<boolean>(false);
  const [showThumbnail, setShowThumbnail] = useState(false);

  const router = useRouter();

  const handleMouseEnter = () => {
    setShowThumbnail(true);
  };

  const handleMouseLeave = () => {
    setShowThumbnail(false);
  };

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
    .refine((data) => data.password === data.confirmPassword, {
      message: "The passwords did not match",
      path: ["confirmPassword"],
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
          setUploadingPicture(true); // Disable the "Update Profile" button

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
        } finally {
          setUploadingPicture(false); // Re-enable the "Update Profile" button
        }
      }

      const validation =
        registrationPayloadSchema.safeParse(registrationPayload);
      if (validation.success) {
        setValidatedRegistrationPayload(validation.data);
      } else {
        console.error(validation.error);
      }

      // Move the parsing and sign-up logic here

      const response = await emailSignUp(validatedRegistrationPayload);

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

  useEffect(() => {
    let componentIsMounted = true;

    const handleUploadProfilePicture = async () => {
      try {
        setUploadingPicture(true); // Disable the "Update Profile" button
        const response = await uploadProfilePicture(
          profilePicture!,
          profilePicture!.name + uuid()
        );

        if (componentIsMounted) {
          setRegistrationPayload({
            ...registrationPayload,
            profilePicture: response,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUploadingPicture(false); // Re-enable the "Update Profile" button
      }
    };

    if (profilePicture !== null) {
      handleUploadProfilePicture();
    }

    return () => {
      componentIsMounted = false;
    };
  }, [profilePicture]);

  useEffect(() => {
    // Perform validation and logging when profilePicture changes
    if (
      registrationPayload.userName &&
      registrationPayload.email &&
      registrationPayload.password &&
      registrationPayload.confirmPassword
    ) {
      const validation =
        registrationPayloadSchema.safeParse(registrationPayload);
      if (validation.success) {
        setValidatedRegistrationPayload(validation.data);
      }
    }
  }, [registrationPayload]);

  return (
    <div className="flex flex-col items-center w-[90vw] m-0 m-auto mt-20">
      <Link href="/login">
        {/*  Entire tag is wrapped in link on purpose, just to make it easier to click */}
        <p className="text-sm pb-8">
          Accidentally clicked register? No prob,
          <span className="text-red-400"> log in here.</span>
        </p>
      </Link>
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
        <div className="flex-col  py-2">
          <label htmlFor="profilePicture" className="flex py-1">
            <div className="bg-slate-500 w-full py-2 rounded text-center cursor-pointer">
              Upload Profile Picture{" "}
            </div>
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleChange}
            onKeyDown={handleKeypress}
            className={"text-white self-end w-full py-1 rounded hidden"}
          />
        </div>
      </div>

      <div className="flex items-end justify-center py-4  w-9/12 ">
        <button
          className={`bg-green-500 w-full py-2 rounded ${
            uploadingPicture ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="button"
          onClick={() => handleSignUp()}
          disabled={uploadingPicture}
        >
          Sign Up
        </button>
      </div>

      <ToastContainer position="bottom-center" />

      <footer className="text-sm pt-8">
        <span className="text-pink-400">*</span> Please note, if you don&apos;t
        choose to upload a Profile picture, you&apos;ll receive a placeholder
        picture of{" "}
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="text-pink-400 border-b-pink-400 border-dotted border-b-2"
        >
          Kirby
        </span>
        <div className="flex justify-end">
          {showThumbnail && (
            <Image
              src="https://kirby.nintendo.com/assets/img/home/kirby-pink.png"
              alt="Thumbnail of kirby, protagonist of popular video game series, Kirby."
              width={100}
              height={100}
              className="flex justify-end"
            />
          )}
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
