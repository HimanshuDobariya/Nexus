import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const VerifyEmail = () => {
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();
  const inputsRef = useRef([]);
  const { verifyemail, loading } = useAuthStore();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const code = Object.values(data).join("").toString();
    try {
      await verifyemail({ email, code });
      const username = email.split("@")[0];
      navigate(`/${username}/workspace`);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error.response?.data.message || "Cant't verify your email.",
      });
    }
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

  const handlePaste = (e) => {
    e.preventDefault();

    // Get the pasted data as a string
    const pasteData = e.clipboardData.getData("text").slice(0, 6); // Limit to 6 digits

    // Split the paste data into individual characters
    const fields = pasteData.split("");

    // Loop through the fields and set the value of each input field
    fields.forEach((value, idx) => {
      if (inputsRef.current[idx]) {
        inputsRef.current[idx].value = value; // Set the value of each OTP input
        handleChange({ target: { value, name: `otp${idx}` } }, idx); // Trigger handleChange for each field
      }
    });
  };
  return (
    <div className="w-full">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Verify Your Email</h1>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit otp that was sent to your email.
                </p>
              </div>

              <div className="flex items-center justify-center my-2 space-x-2">
                {[...Array(6)].map((_, index) => (
                  <Controller
                    key={index}
                    name={`otp${index}`}
                    control={control}
                    defaultValue=""
                    rules={{ required: "All fields are required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        maxLength="1"
                        className={`w-10 h-10 text-center !ring-0  ${
                          errors[`otp${index}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }  focus:border-slate-600 hover:border-slate-300`}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        onPaste={handlePaste}
                      />
                    )}
                  />
                ))}
              </div>

              <Button size="lg" type="submit" disabled={loading}>
                {loading && <Loader className="animate-spin" />} Verify Email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
