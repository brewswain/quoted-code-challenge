import Image from "next/image";

interface ProfilePictureIconProps {
  imageUrl: string;
  name: string;
}

const ProfilePictureIcon = ({ imageUrl, name }: ProfilePictureIconProps) => {
  return (
    <Image
      alt={`User ${name}'s Profile picture`}
      src={imageUrl}
      width={50}
      height={50}
      className="rounded-full"
    />
  );
};

export default ProfilePictureIcon;
