// Interestingly, using  TextField here causes me to need to use client mode,
// as there's probably some internal ContextAPI hook usage going on considering how dynamic it is.
"use client";

import { ChangeEvent, useState, useEffect, Suspense } from "react";

import Link from "next/link";

import {
  Button,
  createTheme,
  outlinedInputClasses,
  Theme,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { firebaseAuth } from "@/app/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { addQuote } from "@/app/firebase/firestore/quotes/addQuote";
import { useRouter } from "next/navigation";
import { customTheme } from "./theme";

const QuoteCreationPage = () => {
  const [quote, setQuote] = useState<string>("");
  const [user, setUser] = useState<User | null>();

  const router = useRouter();
  const outerTheme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // pre-emptive destructuring setup in case we end up with more complex quote handling than expected
    const { value } = event.target;
    console.log({ event });
    setQuote(value);
  };

  const handleSubmit = () => {
    const user = firebaseAuth.currentUser;
    user && addQuote(user.uid, quote);

    setQuote("");
    router.push("/feed");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else if (!currentUser) {
        setUser(null);
      }
    });

    console.log({ user });
    return () => unsubscribe();
  }, [user]);

  return (
    <main className="flex flex-col justify-center">
      <div className="flex justify-between">
        <Link href={"/feed"}>
          <ArrowBackIcon className="self-end m-4" />
        </Link>
        <Button
          variant="contained"
          disabled={Boolean(!quote)}
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
          onClick={() => handleSubmit()}
        >
          Quote
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
        <div className="mt-6">
          <Suspense fallback={<p>loading</p>}>
            <ThemeProvider theme={customTheme(outerTheme)}>
              {" "}
              <TextField
                id="custom-css-outlined-input"
                label="Care to Pen a new quote?"
                multiline
                // fullWidth
                minRows={4}
                variant="standard"
                onChange={handleChange}
                value={quote}
              />
            </ThemeProvider>
          </Suspense>
        </div>
      </Box>
    </main>
  );
};

export default QuoteCreationPage;
