import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "@/components/common/DatePicker";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const schema = z.object({
    name: z.string().min(1, "Project name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    setOpen(false);
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-medium">Dashboard</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="m-0"
              variant="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              <Plus /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[468px]">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                create new project and manage with timeline
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2 relative">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" type="text" {...register("name")} />
                {errors.name && (
                  <p className="error-msg">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  rows={4}
                  id="description"
                  placeholder="Type your project discription"
                />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker />
              </div>
              <Button type="submit" size="lg">
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default Dashboard;
