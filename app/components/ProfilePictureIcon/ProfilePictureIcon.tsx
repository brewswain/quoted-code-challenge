import Image from "next/image";

interface ProfilePictureIconProps {
  imageUrl: string;
  name: string;
  dimensions?: number;
}

const ProfilePictureIcon = ({
  imageUrl,
  name,
  dimensions,
}: ProfilePictureIconProps) => {
  return (
    // Hacky take on customizing dimensions, but depending on aspect ratio, even with width
    // and height explicitly set in the props, it would be warped.
    <Image
      alt={`User ${name}'s Profile picture`}
      src={imageUrl}
      width={dimensions ? dimensions : 50}
      height={dimensions ? dimensions : 50}
      className={`rounded-full h-[${dimensions}px] w-[${dimensions}px] `}
    />
  );
};

export default ProfilePictureIcon;
