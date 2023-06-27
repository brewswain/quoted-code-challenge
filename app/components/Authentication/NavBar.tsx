"use client";

import { Suspense, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { firebaseSignOut } from "@/app/firebase/authentication";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/firebase";
import { getUserFromDB } from "@/app/firebase/firestore/getUser";
import { DocumentData } from "firebase/firestore";

import ProfilePictureIcon from "../ProfilePictureIcon/ProfilePictureIcon";

const NavBar = () => {
  const [value, setValue] = useState<number>(0);
  // implementation taken from https://mui.com/material-ui/react-menu/
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<undefined | DocumentData>(undefined);

  const isMenuOpen = Boolean(anchorEl);
  const router = useRouter();

  // It should be noted that NextJS performs request Deduping. This is why there are some repeated calls throughout the app as opposed to using global state:
  // https://nextjs.org/docs/app/building-your-application/data-fetching#parallel-and-sequential-data-fetching
  // That being said i'm unsure if this applies only to fetch requests themselves, or if making calls to firebase's
  // observer/subscription flow also gets deduped.

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        if (currentUser) {
          const user = await getUserFromDB(currentUser.uid);

          setUser(user);
        } else if (!currentUser) {
          return;
        }
      }
    );

    // Cleanup the event listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    firebaseSignOut();
    handleClose();
    router.push("/login");
  };

  return (
    <Box sx={{ width: "100vw", position: "fixed", bottom: 0, left: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          backgroundColor: "rgb(var(--background-start-rgb))",
          borderTop: "1px solid #6a6a6a",
          height: "5rem",
        }}
      >
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction
          label="Favorites"
          icon={<FavoriteIcon />}
          sx={{ color: "white" }}
        />

        {user ? (
          <Suspense fallback={<p className="text-black">loading</p>}>
            <BottomNavigationAction
              icon={
                <ProfilePictureIcon
                  name={user.user_name}
                  imageUrl={user.profile_picture}
                />
              }
              onClick={handleClick}
            />
          </Suspense>
        ) : (
          <BottomNavigationAction
            label="Loading..."
            icon={<AccountCircleIcon />}
            sx={{ color: "white" }}
          />
        )}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleClose}
        >
          <Link href="/settings">
            <MenuItem onClick={handleClose}>Settings</MenuItem>
          </Link>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </BottomNavigation>
    </Box>
  );
};

export default NavBar;
