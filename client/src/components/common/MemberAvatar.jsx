import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

const MemberAvatar = ({ name }) => {
  // console.log(name)
  return (
    <Avatar className="!size-12 transition border border-e-neutral-300 rounded-full  overflow-hidden">
      <AvatarFallback className="text-neutral-500 bg-neutral-200 font-medium text-lg h-full w-full flex items-center justify-center">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
export default MemberAvatar;
