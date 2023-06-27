import { toast } from "react-toastify";

// Should be light for now, but it's useful to have custom error handling at the beginning of our development process

export const genericErrorToastNotify = () =>
  // Toast is left purposefully vague for security purposes--use this for stuff like authentication problems
  toast("Something went wrong :( Please check your details and try again");

export const signOutErrorToastNotify = () => {
  toast(
    "Couldn't Sign out. This is probably not Quoted's fault, please try again"
  );
};

export const fileUploadErrorToastNotify = () => {
  toast("An error occurred while attempting to upload file.");
};
