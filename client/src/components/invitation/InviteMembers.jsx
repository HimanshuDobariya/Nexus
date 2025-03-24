import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import DottedSeperator from "@/components/common/DottedSeperator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import useWorkspaceInviteCode from "@/hooks/useWorkspaceInviteCode";
import { Roles } from "../enums/RoleEnums";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  roleId: z.string(),
});

const InviteMembers = ({ roles, isLoading }) => {
  const memberRoleId =
    roles.find((role) => role.name === Roles.MEMBER)?._id || "";
  const [isInviting, setIsInviting] = useState(false);
  const { workspaceId } = useParams();
  const { inviteCode } = useWorkspaceInviteCode(workspaceId);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      roleId: memberRoleId,
    },
  });

  useEffect(() => {
    // Update roleId in form when roles are fetched
    form.setValue("roleId", memberRoleId);
  }, [memberRoleId, form]);

  const onSubmit = async (values) => {
    try {
      setIsInviting(true);
      const { data } = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/members/workspace/${inviteCode}/invite`,
        {
          workspaceId: workspaceId,
          email: values.email,
          roleId: values.roleId || memberRoleId,
        }
      );
      toast({
        variant: "success",
        description: data.message,
      });
      setIsInviting(false);
      form.reset({ email: "", roleId: memberRoleId });
    } catch (error) {
      console.log(error);
      setIsInviting(false);
      toast({
        variant: "destructive",
        description: error.response?.data.message || `Error in invite member`,
      });
    }
  };

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Invite People to Workspace</CardTitle>
      </CardHeader>

      <DottedSeperator className="px-7" />

      <CardContent className="p-7">
        {isLoading ? (
          <Loader className="animate-spin mx-auto" />
        ) : (
          <Form {...form}>
            <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Enter Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage className="error-msg" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => {
                  return (
                    <FormItem className="max-w-[300px] relative">
                      <FormLabel>Select Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || memberRoleId}
                        onOpenChange={setIsOpen}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <span className="capitalize">
                              {roles
                                .find((role) => role._id === field.value)
                                ?.name.toLowerCase() || "Select a role"}
                            </span>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-w-[300px]">
                          {roles.map((role) => {
                            return (
                              <SelectItem
                                key={role._id}
                                value={role._id}
                                className="h-16"
                              >
                                <div className="flex flex-col">
                                  <span className="capitalize">
                                    {role.name.toLowerCase()}
                                  </span>
                                  {isOpen && (
                                    <span className="text-[10px] leading-tight text-gray-500">
                                      {role.description}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage className="error-msg" />
                    </FormItem>
                  );
                }}
              />

              {/* Form Actions */}
              <CardFooter className="p-0 flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    form.reset({ email: "", roleId: memberRoleId })
                  }
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isInviting}>
                  {" "}
                  {isInviting && <Loader className="animate-spin" />} Invite
                  Member
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default InviteMembers;
