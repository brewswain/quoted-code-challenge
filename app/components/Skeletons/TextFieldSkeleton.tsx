import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootContainer = styled("section")(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  minHeight: 100,
  width: "90vw",
}));

const TextFieldSkeleton = () => {
  return (
    <RootContainer>
      <Skeleton variant="text" className="h-40" />
    </RootContainer>
  );
};

export default TextFieldSkeleton;
