import { useRef } from "react";
import { Card, Input, Typography, Button } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
const VerifyEmail = () => {
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();
  const inputsRef = useRef([]);

  const onSubmit = (data) => {
    const otp = Object.values(data).join(""); // Combine all OTP digits
    console.log("Entered OTP:", otp);
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
    setValue(`otp${index}`, value); // Update form value

    if (value && index < 5) {
      inputsRef.current[index + 1].focus(); // Move to the next input
    }

    trigger(`otp${index}`); // Validate field
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus(); // Move to the previous input
    }
  };

  return (
    <Card className="w-full p-4 md:max-w-[456px] mx-auto">
      <Typography variant="h3" color="blue-gray" className="mb-2">
        Verify Your Email
      </Typography>
      <Typography className="mb-4 text-gray-600 font-normal text-sm text-center">
        Enter the 6-digit verification code that was sent to your email.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center my-2 space-x-2">
          {[...Array(6)].map((_, index) => (
            <Controller
              key={index}
              name={`otp${index}`}
              control={control}
              defaultValue=""
              rules={{ required: "All fields are required" }}
              render={({ field }) => (
                <input
                  {...field}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className={`w-10 h-10 bg-transparent text-center placeholder:text-slate-400 text-slate-700 text-lg border ${
                    errors[`otp${index}`] ? "border-red-500" : "border-gray-300"
                  } rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                />
              )}
            />
          ))}
        </div>

        <Button color="gray" size="md" className="mb-4 mt-5" fullWidth type="submit">
          Verify Email
        </Button>
      </form>

      <Typography
        variant="small"
        className="text-center font-normal text-blue-gray-900 "
      >
        Did not receive the code?{" "}
        <span className="font-bold hover:underline cursor-pointer">Resend</span>
      </Typography>
    </Card>
  );
};
export default VerifyEmail;
