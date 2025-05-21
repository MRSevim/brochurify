import { loginAction } from "@/utils/serverActions/userActions";
import { User } from "@/utils/Types";
import { GoogleLogin } from "@react-oauth/google";

export const GoogleLoginComp = ({
  handleBefore,
  handleAfter,
  rememberMe,
}: {
  handleBefore: () => void;
  handleAfter: (error: string, user: User) => void;
  rememberMe: boolean;
}) => {
  const handleGoogleLogin = async (credential: any) => {
    handleBefore();
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
