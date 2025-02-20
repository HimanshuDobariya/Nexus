import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DottedSeperator from "@/components/common/DottedSeperator";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "lucide-react";

const formSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
      "Must contain uppercase, number & special letter."
    ),
  confirmPassword: z.string().min(1, "Confirm password is required."),
});

const ResetPassword = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { resetPassword, loading } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useParams();

  const onSubmit = async (data) => {
    try {
      await resetPassword(data, token);
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Failed to reset password",
      });
    }
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>

        <CardDescription className="px-5">
          Please enter your new password below. Make sure it meets the required
          criteria.
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeperator />
      </div>

      <CardContent className="px-7 py-5">
        <Form {...form}>
          <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-7">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="error-msg" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="error-msg" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin !size-7" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default ResetPassword;
