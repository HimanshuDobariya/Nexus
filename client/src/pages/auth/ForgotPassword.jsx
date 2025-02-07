import { Typography, Input, Button, Card } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { IoAlertCircle } from "react-icons/io5";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CiMail } from "react-icons/ci";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword } = useAuthStore();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data);
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="w-full p-4 md:max-w-[456px] mx-auto">
      {!isSubmitted ? (
        <>
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Forgot Your Password
          </Typography>
          <Typography className="mb-4 text-gray-600 font-normal text-sm text-center">
            Please enter the email address you'd like your password reset
            information sent to
          </Typography>

          <form className=" text-left" onSubmit={handleSubmit(onSubmit)}>
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

            <Button
              color="gray"
              size="lg"
              className="mt-8"
              fullWidth
              type="submit"
            >
              Request reset link
            </Button>
          </form>
        </>
      ) : (
        <>
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Email Sent!
          </Typography>
          <Typography className="mb-4 text-gray-600 font-normal text-sm text-center">
            A password reset link has been sent to your email address
          </Typography>
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 font-extrabold">
            <CiMail className="h-14 w-14 text-white" />
          </div>
          <Typography variant="paragraph" className="mt-2 text-gray-600">
            If you don't see the email, be sure to check your spam or junk
            folder. Or you can resend the email.
          </Typography>
        </>
      )}

      <div className="flex justify-center mt-5">
        <Link
          to="/login"
          className="font-medium hover:underline text-blue-500 text-sm"
        >
          back to login
        </Link>
      </div>
    </Card>
  );
};
export default ForgotPassword;
