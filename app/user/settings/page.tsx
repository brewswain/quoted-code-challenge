"use client";

import { useSearchParams } from "next/navigation";

import ProfilePictureIcon from "@/app/components/ProfilePictureIcon/ProfilePictureIcon";
import { ChangeEvent, useEffect, useState } from "react";
import { editUser } from "@/app/firebase/firestore/users/editUser";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const [name, setName] = useState<string>("");

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");
  const imageUrl = searchParams.get("imageUrl");
  const uid = searchParams.get("uid");

  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (name === "profilePicture" && files !== null) {
      const picture = files[0];

      setProfilePicture(picture);
    } else {
      setName(value);
    }
  };

  const updateProfile = async () => {
    const response = await editUser(uid!, {
      userName: name,
      profilePicture: imageUrl!,
    });
    if (response) {
      router.push("/feed");
    }
  };

  useEffect(() => {
    if (userName) {
      setName(userName);
    }
  }, []);

  return (
    <div>
      <header>
        <h2>Edit User</h2>
        <ProfilePictureIcon name={name} imageUrl={imageUrl!} dimensions={150} />

        <div className="flex flex-col w-9/12">
          <div className="flex-col py-2">
            <label className="flex py-1">Username: </label>
            <input
              type="string"
              name="userName"
              onChange={handleChange}
              value={name}
              className="text-black w-full py-1 rounded"
            />
          </div>
        </div>
      </header>
      <div className="flex items-end justify-center py-4  w-9/12 ">
        <button
          className="bg-green-500 w-full py-2 rounded"
          type="button"
          onClick={() => updateProfile()}
        >
          Update Profile{" "}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
