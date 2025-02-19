import WorkspaceForm from "@/components/common/WorkspaceForm";
import { useState } from "react";

const CreateWorkspace = () => {
  const [open, setOpen] = useState(true);
  return <WorkspaceForm open={true} setOpen={setOpen}  />;
};
export default CreateWorkspace;
