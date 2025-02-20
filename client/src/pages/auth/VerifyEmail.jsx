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
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "lucide-react";
import { useRef } from "react";

const otpSchema = z.object({
  otp: z
    .array(z.string().length(1).regex(/^\d$/))
    .length(6, "OTP must be exactly 6 digits"),
});

const VerifyEmail = () => {
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: Array(6).fill(""),
    },
  });
  const inputsRef = useRef([]);
  const { loading, user, verifyemail } = useAuthStore();
  const navigate = useNavigate();

  // const navigate = useNavigate();

  const handleChange = (e, index, field) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
    const otpArray = [...form.getValues("otp")];
    otpArray[index] = value; // Update the specific OTP digit
    form.setValue("otp", otpArray, { shouldValidate: true });

    // Move focus to next input if a number is entered
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .replace(/[^0-9]/g, ""); // Allow only digits
    const otpArray = pasteData.split("");

    // Update form values and set input fields
    form.setValue("otp", otpArray.concat(Array(6 - otpArray.length).fill("")), {
      shouldValidate: true,
    });

    // Focus on the last filled input
    if (inputsRef.current[otpArray.length - 1]) {
      inputsRef.current[otpArray.length - 1].focus();
    }
  };

  const onSubmit = async (data) => {
    try {
      const verificationCode = data.otp.join("");
      await verifyemail({ email: user?.email, code: verificationCode });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Failed to verify email.",
      });
    }
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Verify Your Email</CardTitle>

        <CardDescription className="px-5">
          Enter the 6-digit otp that was sent to your email.
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeperator />
      </div>

      <CardContent className="px-7 py-5">
        <Form {...form}>
          <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-center my-2 space-x-2 relative">
              {Array(6)
                .fill("")
                .map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`otp.${index}`} // Dot notation for array
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            ref={(el) => (inputsRef.current[index] = el)}
                            type="text"
                            maxLength="1"
                            className={`w-10 h-10 text-center !ring-0 ${
                              form.formState.errors.otp?.[index]
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:border-slate-600 hover:border-slate-300`}
                            onChange={(e) => handleChange(e, index, field)}
                            onKeyDown={(e) => handleBackspace(e, index)}
                            onPaste={handlePaste}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}

              {form.formState.errors.otp && (
                <p className="error-msg left-auto">
                  {form.formState.errors.otp.root?.message ||
                    "OTP must be exactly 6 digits"}
                </p>
              )}
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
                "Verify Email"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default VerifyEmail;
