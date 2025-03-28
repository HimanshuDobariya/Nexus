import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const GoogleLoginComponent = () => {
  const { googleLogin, loading } = useAuthStore();
  const responseGoogle = async (authResult) => {
    if (!authResult.code) return;
    try {
      await googleLogin(authResult.code);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
    ux_mode: "popup",
  });

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full p-0"
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      {loading ? (
        <Loader className="!size-5 animate-spin" />
      ) : (
        <>
          <FcGoogle className="mr-2 !size-5" />
        </>
      )}
      Login with Google
    </Button>
  );
};
export default GoogleLoginComponent;
