import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
      "Must contain uppercase, number & special letter."
    ),
});

const Signup = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const navigate = useNavigate();
  const { signup, loading } = useAuthStore();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      await signup(data);
      localStorage.setItem("email", data.email);
      navigate("/verify-email");
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Signup failed.",
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
                <h1 className="text-2xl font-bold">Create An Account</h1>
                <p className="text-sm text-muted-foreground">
                  Signup with your Email or Google account
                </p>
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="user name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="error-msg">{errors.name.message}</p>
                )}
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
              <div className="grid gap-2 relative">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type={passwordShown ? "text" : "password"}
                  placeholder="******"
                  {...register("password")}
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

                {errors.password && (
                  <p className="error-msg">{errors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full mt-2 "
                size="lg"
                disabled={loading}
              >
                {loading && <Loader className="animate-spin" />}
                Sign up
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <FcGoogle /> Google
                </Button>
                <Button variant="outline" className="w-full">
                  <IoLogoApple /> Apple
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Signup;
