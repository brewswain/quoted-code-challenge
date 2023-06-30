// Interestingly, using  TextField here causes me to need to use client mode,
// as there's probably some internal ContextAPI hook usage going on considering how dynamic it is.
"use client";

import { ChangeEvent, useState, useEffect, Suspense } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
import { customTheme } from "../new/theme";
import { getUserFromDB } from "@/app/firebase/firestore/users/getUser";
import { DocumentData } from "firebase/firestore";
import { editQuote } from "@/app/firebase/firestore/quotes/editQuote";

export interface QuotePayload {
  quote: string;
  author: string;
}

const EditQuotePage = () => {
  const searchParams = useSearchParams();
  const initialQuote = searchParams.get("initialQuote");
  const initialAuthor = searchParams.get("initialAuthor");
  const quoteUid = searchParams.get("quoteUid");
  const userUid = searchParams.get("userUid");

  // state has to be placed below our searchParams initialisation. Also we can use non-null assertions with
  // more confidence since this route is accessed only with our params attached, and we have a redirect just
  // in case
  const [quoteText, setQuoteText] = useState<string>(initialQuote!);
  const [author, setAuthor] = useState<string>(initialAuthor!);
  const router = useRouter();
  const outerTheme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    if (name === "quote") {
      setQuoteText(value);
    } else {
      if (name === "author") {
        setAuthor(value);
      }
    }
  };

  const handleEdit = () => {
    editQuote(userUid!, quoteUid!, quoteText, author);
    router.push("/feed");
  };

  useEffect(() => {
    // Check if any required params are missing, then redirect to /feed
    if (!initialQuote || !initialAuthor || !quoteUid || !userUid) {
      router.push("/feed");
    }
  }, [initialAuthor, initialQuote, quoteUid, router, userUid]);

  return (
    <main className="flex flex-col justify-center">
      <div className="flex justify-between">
        <Link href={"/feed"}>
          <ArrowBackIcon className="self-end m-4" />
        </Link>
        <Button
          variant="contained"
          disabled={Boolean(!author || !quoteText)}
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
          // Check <CreateQuoteButton /> for why I'm using both `sx` and `style`.
          style={{
            backgroundColor: "rgb(var(--icon-button-rgb))",
          }}
          onClick={() => handleEdit()}
        >
          Edit Quote
        </Button>
      </div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "90vw" },
        }}
        noValidate
        autoComplete="off"
      >
        <div className="mt-6 px-8 flex justify-center ">
          <Suspense fallback={<p>loading</p>}>
            <ThemeProvider theme={customTheme(outerTheme)}>
              {" "}
              <TextField
                id="custom-css-outlined-input"
                label="Let's edit this quote!"
                multiline
                fullWidth
                minRows={4}
                variant="standard"
                onChange={handleChange}
                name="quote"
                value={quoteText}
              />
            </ThemeProvider>
          </Suspense>
        </div>
      </Box>
      <FormGroup></FormGroup>
      <div className="mt-6 px-8 flex justify-center">
        <ThemeProvider theme={customTheme(outerTheme)}>
          <TextField
            label="Change the Author here!"
            variant="standard"
            fullWidth
            onChange={handleChange}
            name="author"
            value={author}
          />
        </ThemeProvider>
      </div>
    </main>
  );
};

export default EditQuotePage;
