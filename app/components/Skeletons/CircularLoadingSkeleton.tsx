// components/CircularLoadingSkeleton.tsx

import { Skeleton } from "@mui/material";

const CircularLoadingSkeleton = () => {
  return (
    <Skeleton
      variant="circular"
      width={50}
      height={50}
      sx={{ borderRadius: "50%", bgcolor: "grey.600" }}
    />
  );
};

export default CircularLoadingSkeleton;
