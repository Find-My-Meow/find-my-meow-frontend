import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const LoginPage = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const handleLoginSuccess = (response: any) => {
    console.log("Google Login Success:", response);

    const userIdFromToken = response.clientId; 

    setUserId(userIdFromToken);

    localStorage.setItem("user_id", userIdFromToken);

    console.log("User ID from Google login:", userIdFromToken);
  };

  const handleLoginError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary bg-opacity-[20%]">
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-8 w-[30rem] max-w-md h-[35rem] content-center">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          เข้าสู่ระบบ
        </h1>
        <p className="text-gray-600 text-center mb-8">
          เข้าสู่ระบบด้วย Google Account
        </p>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap
              size="large"
              width={300}
              shape="pill"
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default LoginPage;
