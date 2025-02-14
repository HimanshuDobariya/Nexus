import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const schema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
      "Must contain uppercase, number & special letter."
    ),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
      "Must contain uppercase, number & special letter."
    ),
});

const ResetPassword = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuthStore();
  const { toast } = useToast();
  const { token } = useParams();

  const onSubmit = async (data) => {
    try {
      await resetPassword(data, token);
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Can't reset password",
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
                <h1 className="text-2xl font-bold">Reset Your Password</h1>
                <p className="text-sm text-muted-foreground">
                  Please enter your new password below. Make sure it meets the
                  required criteria.
                </p>
              </div>

              <div className="grid gap-2 relative">
                <div className="flex items-center">
                  <Label htmlFor="newPassword">New Password</Label>
                </div>
                <Input
                  id="newPassword"
                  type={passwordShown ? "text" : "password"}
                  placeholder="******"
                  {...register("newPassword")}
                />
                <span
                  className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => {
                    setPasswordShown((prev) => !prev);
                  }}
                >
                  {passwordShown ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </span>

                {errors.newPassword && (
                  <p className="error-msg">{errors.newPassword.message}</p>
                )}
              </div>
              <div className="grid gap-2 relative">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input
                  id="password"
                  type={confirmPasswordShown ? "text" : "password"}
                  placeholder="******"
                  {...register("confirmPassword")}
                />
                <span
                  className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => {
                    setConfirmPasswordShown((prev) => !prev);
                  }}
                >
                  {confirmPasswordShown ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </span>

                {errors.confirmPassword && (
                  <p className="error-msg">{errors.confirmPassword.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full mt-2"
                size="lg"
                disabled={loading}
              >
                {loading && <Loader className="animate-spin" />}
                Reset Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default ResetPassword;
