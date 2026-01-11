import { loginAction } from "@/features/auth/utils/userActions";
import { User } from "@/utils/Types";
import { GoogleLogin } from "@react-oauth/google";

export const GoogleLoginComp = ({
  handleAfter,
  rememberMe,
}: {
  handleAfter: (error: string, user: User) => void;
  rememberMe: boolean;
}) => {
  const handleGoogleLogin = async (credential: any) => {
    const { error, user } = await loginAction(credential, rememberMe);

    handleAfter(error, user);
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
