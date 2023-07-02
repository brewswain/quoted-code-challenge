// Interestingly, using  TextField here causes me to need to use client mode,
// as there's probably some internal ContextAPI hook usage going on considering how dynamic it is.
"use client";

import { ChangeEvent, useState, useEffect, lazy } from "react";

import Link from "next/link";

import { Button, ThemeProvider, useTheme } from "@mui/material";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { firebaseAuth } from "@/app/firebase";
import { addQuote } from "@/app/firebase/firestore/quotes/addQuote";
import { useRouter } from "next/navigation";
import { customTheme } from "./theme";
import { getUserFromDB } from "@/app/firebase/firestore/users/getUser";
import { DocumentData } from "firebase/firestore";
import TextFieldSkeleton from "@/app/components/Skeletons/TextFieldSkeleton";

// Import statements

// // Define a lazy-loaded version of ThemeProvider using React.lazy()
// const LazyThemeProvider = lazy(
//   () => import("@mui/material/styles/ThemeProvider")
// );

export interface QuotePayload {
  quote: string;
  author: string;
}

const QuoteCreationPage = () => {
  const [quotePayload, setQuotePayload] = useState<QuotePayload>({
    quote: "",
    author: "",
  });
  const [user, setUser] = useState<DocumentData | null>();
  const [uid, setUid] = useState<string>("");
  const [isOriginalQuote, setIsOriginalQuote] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const outerTheme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setQuotePayload({
      ...quotePayload,
      [name]: value,
    });
  };

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOriginalQuote(event.target.checked);
  };

  const handleSubmit = async () => {
    user && addQuote(uid, quotePayload);

    if (user) {
      try {
        const response = await addQuote(uid, quotePayload);

        if (response) {
          setQuotePayload({ quote: "", author: "" });
          router.push("/feed");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUid(currentUser.uid);
        const user = await getUserFromDB(currentUser.uid);
        if (user) {
          setUser(user);
        }
      } else if (!currentUser) {
        console.error("User not found");
        router.push("/login");
      }

      return () => unsubscribe();
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (isOriginalQuote && user) {
      setQuotePayload({
        ...quotePayload,
        author: user.user_name,
      });
    }
  }, [isOriginalQuote]);

  useEffect(() => {
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main className="flex flex-col justify-center items-center mt-20">
      <div className="flex justify-between  w-[90vw] md:w-[40rem]">
        <Link href={"/feed"}>
          <ArrowBackIcon className="self-end m-4" />
        </Link>
        <Button
          variant="contained"
          disabled={Boolean(!quotePayload.author || !quotePayload.quote)}
          sx={{
            borderRadius: "1rem",
            height: "2.2rem",
            margin: "1rem",
            fontSize: ".9rem",
            textTransform: "capitalize",
            "&:hover": {
              bgcolor: "rgb(var(--icon-button-rgb))",
            },
            "&:disabled": {
              color: "white",
              opacity: 0.5,
            },
          }}
          style={{
            backgroundColor: "rgb(var(--icon-button-rgb))",
          }}
          onClick={() => handleSubmit()}
        >
          Quote
        </Button>
      </div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1 },
        }}
        className="w-[90vw] md:w-[40rem] "
        noValidate
        autoComplete="off"
      >
        <div className="mt-6 px-8 flex justify-center">
          {loading ? (
            <TextFieldSkeleton />
          ) : (
            <ThemeProvider theme={customTheme(outerTheme)}>
              <div style={{ minHeight: "200px" }} className=" md:w-full">
                <TextField
                  id="custom-css-outlined-input"
                  label="Care to Pen a new quote?"
                  multiline
                  fullWidth
                  minRows={4}
                  variant="standard"
                  onChange={handleChange}
                  name="quote"
                  value={quotePayload.quote}
                />
              </div>
            </ThemeProvider>
          )}
        </div>

        <FormGroup className="ml-8">
          <FormControlLabel
            className="mt-6"
            control={
              <Checkbox checked={isOriginalQuote} onChange={handleChecked} />
            }
            label="Is this your quote?"
          />
        </FormGroup>
        <div className="mt-6 px-8 flex justify-center">
          {loading ? (
            <TextFieldSkeleton />
          ) : (
            <ThemeProvider theme={customTheme(outerTheme)}>
              <div className="md:w-full">
                <TextField
                  id="custom-css-outlined-input"
                  label="Whose quote is it anyway?"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                  name="author"
                  value={quotePayload.author}
                />
              </div>
            </ThemeProvider>
          )}
        </div>
      </Box>
    </main>
  );
};

export default QuoteCreationPage;
