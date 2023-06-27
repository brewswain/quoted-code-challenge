import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";

// This is my first time using this library, so if it doesn't work as intended we can blame either me for not testing or the maintainer for not giving us close to real random generation 🤔
import uniqueRandomArray from "unique-random-array";

import { firebaseStorage } from "./";
import { fileUploadErrorToastNotify } from "../errors";

// Create a storage reference from our storage service
export const storageRef = ref(firebaseStorage);

export const uploadProfilePicture = async (picture: File, name: string) => {
  const profilePicturesRef = ref(firebaseStorage, `profile_pictures/${name}`);

  try {
    await uploadBytes(profilePicturesRef, picture);

    const imageUrl = await getDownloadURL(profilePicturesRef);
    return imageUrl;
  } catch (error) {
    fileUploadErrorToastNotify();
    console.error(error);
  }
};

export const getRandomPlaceholderImage = async () => {
  const placeholdersRef = ref(firebaseStorage, "placeholders");
  const images = await listAll(placeholdersRef);

  // We use currying here to create a closure that gives us the images.items[] and returns a function that we can then use to retrieve a random item.
  const randomImage = uniqueRandomArray(images.items)();
  // Technically we could have used getDownloadURL(randomImage()) instead, but to be honest it felt like a fun mini functional flex.
  // That being said, if we were to use a more complex method where we'd want to reuse a function with a variety of different arguments, then currying
  // would actually be worth it from a modularity and reusability angle.
  const downloadURL = await getDownloadURL(randomImage);

  return downloadURL;
};
