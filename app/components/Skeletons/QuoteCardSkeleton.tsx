// components/QuoteCardSkeleton.tsx

import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootContainer = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  minHeight: 100,
}));

const AvatarContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const QuoteCardSkeleton = () => {
  return (
    <RootContainer>
      <AvatarContainer>
        <Skeleton variant="circular" width={35} height={35} />
      </AvatarContainer>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="30%" />
    </RootContainer>
  );
};

export default QuoteCardSkeleton;
