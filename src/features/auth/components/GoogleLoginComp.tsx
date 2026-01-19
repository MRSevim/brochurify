import { loginAction } from "@/features/auth/utils/serverActions/userActions";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

export const GoogleLoginComp = ({ rememberMe }: { rememberMe: boolean }) => {
  const handleGoogleLogin = async (credential: any) => {
    const { error } = await loginAction(credential, rememberMe);

    if (error) {
      toast.error(error);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <p className="mb-2">Register through your google account:</p>
        <GoogleLogin
          onSuccess={(credentialResponse: any) => {
            handleGoogleLogin(credentialResponse.credential);
          }}
          onError={() => {
            console.log("Failed logging in with Google");
          }}
        />
      </div>
    </>
  );
};
