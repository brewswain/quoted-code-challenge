"use client";

import Link from "next/link";

import { IconButton } from "@mui/material";

import AddCommentIcon from "@mui/icons-material/AddComment";

const NewQuoteButton = () => {
  return (
    <Link href="/quote/new" className="md:hidden">
      <IconButton
        size="large"
        sx={{
          position: "fixed",
          bottom: "8rem",
          right: "2rem",
          // Prevent hover state from removing background color
          "&:hover": {
            bgcolor: "rgb(var(--icon-button-rgb))",
          },
        }}
        // For some reason, backgroundColor/bgColor while NOT hovered is the only property on sx that reverts once the page loads. everything else works,
        // and it's minor enough that I don't want to waste time delving into this, so I'll just put the style directly here.
        // Also, while i can move everything over, i prefer to follow Material's opinion on how to handle custom styling, and treat the `style` param as
        // an exception rather than the rule. The `sx` implementation also makes hover state easier to work with
        style={{
          backgroundColor: "rgb(var(--icon-button-rgb))",
        }}
      >
        <AddCommentIcon fontSize="inherit" className="text-white" />
      </IconButton>
    </Link>
  );
};

export default NewQuoteButton;
