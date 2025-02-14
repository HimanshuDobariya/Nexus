import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuthStore();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data);
      navigate("/login");
      toast({
        description: "Reset Password link sent on your email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error.response?.data.message || "Error to sent verification link",
      });
    }
  };

  return (
    <div className="w-full">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Your Password</h1>
                <p className="text-sm text-muted-foreground">
                  Please enter the email address you'd like your password reset
                  information sent to
                </p>
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="error-msg">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                size="lg"
                disabled={loading}
              >
                {loading && <Loader className="animate-spin" />}
                Forgot Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default ForgotPassword;
