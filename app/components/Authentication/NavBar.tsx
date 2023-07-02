"use client";

import { useEffect, useState, Suspense } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem,
  Drawer,
  Button,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/firebase";
import { getUserFromDB } from "@/app/firebase/firestore/users/getUser";
import { DocumentData } from "firebase/firestore";
import { firebaseSignOut } from "@/app/firebase/authentication";
import ProfilePictureIcon from "../ProfilePictureIcon/ProfilePictureIcon";

import CircularLoadingSkeleton from "../Skeletons/CircularLoadingSkeleton";

const NavBar = () => {
  const [value, setValue] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<DocumentData | undefined>(undefined);
  const [uid, setUid] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const isMenuOpen = Boolean(anchorEl);

  const router = useRouter();
  const pathname = usePathname();

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 768,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
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
        setIsMounted(true);
      }
    );

    // Cleanup the event listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
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
    <>
      {isMounted && (
        <>
          {isMediumScreen ? (
            <Drawer
              variant="permanent"
              sx={{
                border: "none",
              }}
            >
              <Box
                className="flex flex-col items-center justify-between w-[20vw] h-screen  border-r border-slate-600"
                sx={{
                  backgroundColor: "rgb(var(--background-start-rgb))",
                  border:
                    "1px solid border-color: rgb(71 85 105 / var(--tw-border-opacity))",
                }}
              >
                <div className="flex flex-col items-center mt-10">
                  {" "}
                  <Link href={"/feed"}>
                    <div className="flex p-8">
                      <HomeIcon
                        className={`${
                          pathname === "/feed"
                            ? "text-[rgb(var(--icon-button-rgb))]"
                            : "text-white"
                        } mr-4`}
                      />
                      <div className="text-white text-xl">Home</div>
                    </div>
                  </Link>
                  <Link
                    href={{
                      pathname: "/user/likes",
                      query: {
                        userUid: uid,
                      },
                    }}
                  >
                    <div className="flex p-8">
                      <FavoriteIcon
                        className={`${
                          pathname === "/user/likes"
                            ? "text-[rgb(var(--icon-button-rgb))]"
                            : "text-white"
                        } mr-4`}
                      />
                      <div className="text-white text-xl">Likes</div>
                    </div>
                  </Link>
                  <Link href={"/quote/new"}>
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: "2rem",
                        height: "2.2rem",
                        width: "10rem",
                        margin: "1rem",
                        padding: "2rem",
                        fontSize: "1.2rem",
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
                    >
                      Quote
                    </Button>
                  </Link>
                </div>
                {user && (
                  <Suspense fallback={<CircularLoadingSkeleton />}>
                    <div
                      className="flex justify-between cursor-pointer mb-8"
                      onClick={(event) => handleClick(event)}
                    >
                      <BottomNavigationAction
                        showLabel
                        icon={
                          <ProfilePictureIcon
                            name={user.user_name}
                            imageUrl={user.profile_picture}
                            dimensions={50}
                          />
                        }
                      />
                      <div className="flex ">
                        {" "}
                        <div className="text-white">{user?.user_name}</div>
                        <MoreHorizIcon className="ml-8 text-white" />
                      </div>
                    </div>
                  </Suspense>
                )}
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
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
            </Drawer>
          ) : (
            <Box className="fixed bottom-0 left-0 w-full flex justify-center items-center">
              <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                sx={{
                  backgroundColor: "rgb(var(--background-start-rgb))",
                  height: "5rem",
                  flexGrow: 1,
                }}
                className="border-t border-slate-600"
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
                        pathname === "/feed"
                          ? "rgb(var(--icon-button-rgb))"
                          : "white",
                    }}
                    showLabel
                    onClick={() => router.push("/feed")}
                  />
                  <Link
                    href={{
                      pathname: "/user/likes",
                      query: {
                        userUid: uid,
                      },
                    }}
                  >
                    <BottomNavigationAction
                      showLabel
                      label="Likes"
                      icon={<FavoriteIcon />}
                      sx={{
                        color:
                          pathname === "/user/likes"
                            ? "rgb(var(--icon-button-rgb))"
                            : "white",
                      }}
                      onClick={() => router.push("/favorites")}
                    />
                  </Link>

                  {user ? (
                    <Suspense fallback={<CircularLoadingSkeleton />}>
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
                      showLabel
                      icon={<CircularLoadingSkeleton />}
                      sx={{ color: "white" }}
                    />
                  )}
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
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
          )}
        </>
      )}
    </>
  );
};

export default NavBar;
