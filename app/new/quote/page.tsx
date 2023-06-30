// Interestingly, using  TextField here causes me to need to use client mode,
// as there's probably some internal ContextAPI hook usage going on considering how dynamic it is.
"use client";

import { ChangeEvent, useState, useEffect, Suspense } from "react";

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
  const [author, setAuthor] = useState<string>("");
  const [isOriginalQuote, setIsOriginalQuote] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(true);

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

  const handleSubmit = () => {
    user && addQuote(uid, quotePayload);

    setQuotePayload({ quote: "", author: "" });
    router.push("/feed");
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
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOriginalQuote && user) {
      setQuotePayload({
        ...quotePayload,
        author: user.user_name,
      });
    }
  }, [isOriginalQuote]);

  return (
    <main className="flex flex-col justify-center">
      <div className="flex justify-between">
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
        <div className="mt-6 px-8 flex justify-center ">
          <Suspense fallback={<p>loading</p>}>
            <ThemeProvider theme={customTheme(outerTheme)}>
              {" "}
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
            </ThemeProvider>
          </Suspense>
        </div>
      </Box>
      <FormGroup>
        <FormControlLabel
          className="ml-8 mt-6"
          control={
            <Checkbox checked={isOriginalQuote} onChange={handleChecked} />
          }
          label="Is this your quote?"
        />
      </FormGroup>{" "}
      <div className="mt-6 px-8 flex justify-center">
        {!isOriginalQuote ? (
          <ThemeProvider theme={customTheme(outerTheme)}>
            {" "}
            <TextField
              label="Whose quote is it anyway?"
              variant="standard"
              fullWidth
              onChange={handleChange}
              name="author"
              value={quotePayload.author}
            />
          </ThemeProvider>
        ) : null}
      </div>
    </main>
  );
};

export default QuoteCreationPage;
