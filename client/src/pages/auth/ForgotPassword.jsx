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
import {  useNavigate } from "react-router-dom";
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
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const ForgotPassword = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { forgotPassword, loading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data);
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error.response?.data.message || "Failed to sent password reset link.",
      });
    }
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Forgot Your Password!</CardTitle>

        <CardDescription className="px-5">
          Please enter the email address you'd like your password reset
          information sent to
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
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
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
                "Send Reset Password Link"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default ForgotPassword;
