import { Typography, Input, Button, Card } from "@material-tailwind/react";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoAlertCircle } from "react-icons/io5";

const Signup = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Card className="w-full p-4 md:max-w-[456px] mx-auto">
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Create an Account
        </Typography>
        <Typography className="mb-4 text-gray-600 font-normal text-sm text-center">
          By signing up, you agree to our{" "}
          <Link to="/privacy" className="text-blue-600">
            {" "}
            Privacy Policy{" "}
          </Link>{" "}
          and
          <Link to="/terms" className="text-blue-600">
            Terms of service
          </Link>
        </Typography>
        <form className="mx-auto text-left" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 relative">
            <label htmlFor="name">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Name
              </Typography>
            </label>
            <Input
              id="name"
              color="gray"
              size="lg"
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              placeholder="User Name"
              className="appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {errors.name && (
              <p className="error-message">
                <IoAlertCircle />
                {errors.name.message}
              </p>
            )}
          </div>
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
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
                  message: "Must contain uppercase, number & special letter.",
                },
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
          <Button
            color="gray"
            size="lg"
            className="mt-8"
            fullWidth
            type="submit"
          >
            sign up
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-gray-900 hover:underline"
            >
              Login
            </Link>
          </Typography>
        </form>
      </div>
    </Card>
  );
};
export default Signup;
