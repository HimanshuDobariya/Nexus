import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { useAuthStore } from "../../store/authStore";
import Loader from "../../components/Loader";

const ResetPassword = () => {
  const [passwordShown, setPasswordShown] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuthStore();
  const { token } = useParams();

  const onSubmit = async (data) => {
    try {
      await resetPassword(data, token);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="w-full p-4 md:max-w-[456px] mx-auto">
      <Typography variant="h3" color="blue-gray" className="mb-2">
        Reset Your Password
      </Typography>
      <Typography className="mb-4 text-gray-600 font-normal text-sm text-center">
        Please enter your new password below. Make sure it meets the required
        criteria.
      </Typography>
      <form className="text-left" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 relative">
          <label htmlFor="newPassword">
            <Typography
              variant="small"
              className="mb-2 block font-medium text-gray-900"
            >
              New Password
            </Typography>
          </label>
          <Input
            size="lg"
            placeholder="********"
            {...register("newPassword", {
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
          {errors.newPassword && (
            <p className="error-message">
              <IoAlertCircle />
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="mb-6 relative">
          <label htmlFor="confirmPassword">
            <Typography
              variant="small"
              className="mb-2 block font-medium text-gray-900"
            >
              Confirm Password
            </Typography>
          </label>
          <Input
            size="lg"
            placeholder="********"
            {...register("confirmPassword", {
              required: "Please confirm the password",
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
          {errors.confirmPassword && (
            <p className="error-message">
              <IoAlertCircle />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button color="gray" size="lg" className="mt-8" fullWidth type="submit">
          {loading ? <Loader /> : "Reset password"}
        </Button>
      </form>
    </Card>
  );
};
export default ResetPassword;
