import { useNavigate } from "react-router-dom";
import Card from "../components/card";
import DefaultButton from "../components/DefaultButton";

const UserProfile = () => {
  const navigate = useNavigate();

  // Retrieve user data from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null; // If no user, return null
  const user_id = localStorage.getItem("user_id");

  if (!user) {
    return (
      <div className="h-full flex justify-center items-center">
        <h2 className="text-xl font-semibold text-gray-700">กรุณาเข้าสู่ระบบ</h2>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Title at the top center */}
      <div className="flex justify-center items-start">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ข้อมูลผู้ใช้งาน</h1>
        </div>
      </div>

      {/* User Information */}
      <div className="flex flex-col items-center mt-6 p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
        <img
          src={user.picture}
          alt="User Profile"
          referrerPolicy="no-referrer"
          className="w-24 h-24 rounded-full border border-gray-300 object-cover"
        />

        <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>

      {/* Button aligned to the right */}
      <div className="flex justify-end pt-4 mt-2 font-semibold">
        <DefaultButton
          title="สร้างโพสต์ใหม่"
          color="primary"
          onClick={() => navigate("/create-newpost")}
        />
      </div>

      {/* Grid layout */}
      <div className="flex justify-center mt-10">
        <Card postType={String(user_id)} />
      </div>
    </div>
  );
};

export default UserProfile;
