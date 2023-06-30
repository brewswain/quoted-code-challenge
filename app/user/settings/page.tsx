"use client";
import { ChangeEvent, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import ProfilePictureIcon from "@/app/components/ProfilePictureIcon/ProfilePictureIcon";
import { editUser } from "@/app/firebase/firestore/users/editUser";

import { useRouter } from "next/navigation";

import { v4 as uuid } from "uuid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { genericErrorToastNotify } from "@/app/errors";
import { uploadProfilePicture } from "@/app/firebase/storage";
import { z } from "zod";
import Link from "next/link";

interface UpdateDetails {
  userName: string;
  profilePicture?: string;
}

const SettingsPage = () => {
  const [updateProfilePayload, setUpdateProfilePayload] =
    useState<UpdateDetails>({
      userName: "",
      profilePicture: "",
    });
  const [validatedUpdateProfilePayload, setValidatedUpdateProfilePayload] =
    useState<UpdateDetails>({
      userName: "",
      profilePicture: "",
    });
  const [localPicture, setLocalPicture] = useState<File | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const searchParams = useSearchParams();
  const userName = searchParams.get("name");
  const imageUrl = searchParams.get("imageUrl");
  const uid = searchParams.get("uid");

  const router = useRouter();
  const updateProfilePayloadSchema = z.object({
    userName: z.string().min(1, { message: "This field cannot be empty" }),
    profilePicture: z.string().optional(),
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (name === "profilePicture" && files !== null) {
      const picture = files[0];
      setLocalPicture(picture);
    } else {
      setUpdateProfilePayload({ ...updateProfilePayload, [name]: value });
    }
  };

  const updateProfile = async () => {
    try {
      const response = await editUser(uid!, {
        userName: validatedUpdateProfilePayload.userName,
        profilePicture: validatedUpdateProfilePayload.profilePicture!,
      });
      console.log({ response });
      if (response) {
        router.push("/feed");
      }
    } catch (error) {
      genericErrorToastNotify();
      console.error(error);
    }
  };

  useEffect(() => {
    if (userName) {
      setUpdateProfilePayload({ ...updateProfilePayload, userName });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const handleUploadProfilePicture = async () => {
      try {
        setUploadingPicture(true); // Disable the "Update Profile" button
        const response = await uploadProfilePicture(
          localPicture!,
          localPicture!.name + uuid()
        );

        if (isMounted) {
          setUpdateProfilePayload({
            ...updateProfilePayload,
            profilePicture: response,
          });

          const validation =
            updateProfilePayloadSchema.parse(updateProfilePayload);
          console.log("validating");
          setValidatedUpdateProfilePayload(validation);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUploadingPicture(false); // Re-enable the "Update Profile" button
      }
    };

    if (localPicture !== null) {
      handleUploadProfilePicture();
    }

    return () => {
      isMounted = false;
    };
  }, [localPicture]);

  useEffect(() => {
    console.log("validating");
    const validation =
      updateProfilePayloadSchema.safeParse(updateProfilePayload);
    if (validation.success) {
      setValidatedUpdateProfilePayload(validation.data);
    }
  }, [updateProfilePayload]);

  useEffect(() => {
    console.log({ validatedUpdateProfilePayload });
  }, [validatedUpdateProfilePayload]);

  useEffect(() => {
    console.log({ updateProfilePayload });
  }, [updateProfilePayload]);

  return (
    <div>
      <header>
        <Link href={"/feed"}>
          <ArrowBackIcon className="self-end m-4" />
        </Link>
        <h1 className="flex justify-center  text-3xl py-8">
          Edit User Details
        </h1>
      </header>

      <div className="flex justify-center">
        <div className="h-[150px] w-[150px] relative flex">
          <div className="absolute justify-center w-full flex place-self-center items-center  bg-slate-500 rounded-full  h-full opacity-50"></div>
          <label htmlFor="upload">
            <ModeEditIcon className="absolute left-0 right-0 m-auto z-10 flex h-[150px] justify-center  place-self-center cursor-pointer" />
            <input
              type="file"
              id="upload"
              name="profilePicture"
              className="hidden"
              onChange={handleChange}
            />
          </label>
          <ProfilePictureIcon
            name={updateProfilePayload.userName}
            imageUrl={imageUrl!}
            dimensions={150}
          />
        </div>
      </div>
      <div className="flex flex-col items-center pt-8">
        <div className="flex flex-col w-9/12 justify-center">
          <div className="flex-col py-2">
            <label className="flex py-1">Username: </label>
            <input
              type="string"
              name="userName"
              onChange={handleChange}
              value={updateProfilePayload.userName}
              className="text-black w-full py-1 rounded"
            />
          </div>
        </div>

        <div className="flex items-end justify-center py-4  w-9/12 ">
          <button
            className={`bg-green-500 w-full py-2 rounded ${
              uploadingPicture || updateProfilePayload.userName === ""
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            type="button"
            onClick={() => updateProfile()}
            disabled={uploadingPicture || updateProfilePayload.userName === ""}
          >
            Update Profile{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
