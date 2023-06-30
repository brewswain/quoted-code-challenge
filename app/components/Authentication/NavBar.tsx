"use client";

// Import the necessary modules and components
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { firebaseSignOut } from "@/app/firebase/authentication";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/firebase";
import { getUserFromDB } from "@/app/firebase/firestore/users/getUser";
import { DocumentData } from "firebase/firestore";
import ProfilePictureIcon from "../ProfilePictureIcon/ProfilePictureIcon";
import { usePathname, useRouter } from "next/navigation";

const NavBar = () => {
  const [value, setValue] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<DocumentData | undefined>(undefined);
  const [uid, setUid] = useState<string | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        if (currentUser) {
          const user = await getUserFromDB(currentUser.uid);
          setUid(currentUser.uid);
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
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        bottom: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          backgroundColor: "rgb(var(--background-start-rgb))",
          borderTop: "1px solid #6a6a6a",
          height: "5rem",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeOutlinedIcon />}
            sx={{
              color:
                pathname === "/feed" ? "rgb(var(--icon-button-rgb))" : "white",
            }}
            showLabel
            onClick={() => router.push("/")}
          />
          <BottomNavigationAction
            showLabel
            label="Favorites"
            icon={<FavoriteIcon />}
            sx={{
              color:
                pathname === "/favorites"
                  ? "rgb(var(--icon-button-rgb))"
                  : "white",
            }}
            onClick={() => router.push("/favorites")}
          />

          {user ? (
            <Suspense fallback={<p className="text-white">loading</p>}>
              <BottomNavigationAction
                showLabel
                icon={
                  <ProfilePictureIcon
                    name={user.user_name}
                    imageUrl={user.profile_picture}
                    dimensions={50}
                  />
                }
                onClick={handleClick}
              />
            </Suspense>
          ) : (
            <BottomNavigationAction
              label="Loading..."
              showLabel
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
            <Link
              href={{
                pathname: "/user/settings",
                query: {
                  name: user?.user_name,
                  imageUrl: user?.profile_picture,
                  uid: uid,
                },
              }}
            >
              <MenuItem onClick={handleClose}>Settings</MenuItem>
            </Link>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </BottomNavigation>
    </Box>
  );
};

export default NavBar;
