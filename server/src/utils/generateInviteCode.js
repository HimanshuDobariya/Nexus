import { v4 as uuidv4 } from "uuid";

const generateInviteCode = () => {
  return uuidv4().replace(/-/g, "").substring(0, 8);
};

export default generateInviteCode;
