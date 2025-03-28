import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse: any) => {
    const decodedToken: any = jwtDecode(credentialResponse.credential);
    const userInfo = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
    };
    const userId = decodedToken.sub;

    localStorage.setItem("user_id", userId);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    window.dispatchEvent(new Event("userLogin"));
    navigate("/lost-cat");
  };

  const handleLoginError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-screen bg-[#FFF4ED] px-4 gap-12">
      {/* Left: Logo & Welcome */}
      <div className="text-center lg:text-left">
        <div className="font-paytone text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-2 leading-tight whitespace-nowrap">
          <span className="text-primary">Find</span>{" "}
          <span className="text-neutral">My</span>{" "}
          <span className="text-secondary">Meow</span>
        </div>
        <div className="mt-5 mb-5 text-gray-800 text-base sm:text-lg">
          <span className="text-primary font-bold">Find My Meow</span>
          <br />
          สร้างขึ้นเพื่อตามหาแมวที่หายไปกลับมาพบเจ้าของอีกครั้ง
          <br />
          และตามหาครอบครัวอบอุ่นแก่แมวจรจัด
        </div>
      </div>

      {/* Right: Login Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl px-10 py-12 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">เข้าสู่ระบบด้วย</h2>
        <p className="text-gray-600 mb-8">
          เข้าสู่ระบบด้วย Google Account เพื่อเริ่มต้นใช้งาน
        </p>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
          <div className="flex flex-col items-center space-y-6">
            <div className="p-3 bg-[#FFE9DB] border border-orange-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                useOneTap
                shape="pill"
                width="300"
                size="large"
                theme="outline"
              />
            </div>
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default LoginPage;
