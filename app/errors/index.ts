import { toast } from "react-toastify";

// Should be light for now, but it's useful to have custom error handling at the beginning of our development process

export const genericErrorToastNotify = () =>
  // Toast is left purposefully vague for security purposes--use this for stuff like authentication problems
  toast("Something went wrong :( Please check your details and try again");
