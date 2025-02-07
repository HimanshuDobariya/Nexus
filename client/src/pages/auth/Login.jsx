import { Typography, Input, Button, Card } from "@material-tailwind/react";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoAlertCircle } from "react-icons/io5";
import { useAuthStore } from "../../store/authStore";
import Loader from "../../components/Loader";

const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className="w-full p-4 md:max-w-[456px] mx-auto">
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Welcome Back
        </Typography>
        <form className="mx-auto text-left" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 relative">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="example@mail.com"
              className="appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {errors.email && (
              <p className="error-message">
                <IoAlertCircle />
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              {...register("password", {
                required: "Password is required",
              })}
              className="appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              type={passwordShown ? "text" : "password"}
              icon={
                <span
                  className="cursor-pointer"
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
              }
            />
            {errors.password && (
              <p className="error-message">
                <IoAlertCircle />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="font-medium hover:underline text-blue-500 text-sm">
              Forgot password?
            </Link>
          </div>

          <Button
            color="gray"
            size="lg"
            className="mt-4"
            fullWidth
            type="submit"
          >
            {loading ? <Loader /> : "Sign in"}
          </Button>

          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <Button
            variant="outlined"
            size="lg"
            className=" flex h-12 items-center justify-center gap-2"
            fullWidth
          >
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-6 w-6"
            />{" "}
            sign in with google
          </Button>
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-gray-900 hover:underline"
            >
              Signup
            </Link>
          </Typography>
        </form>
      </div>
    </Card>
  );
};
export default Login;
