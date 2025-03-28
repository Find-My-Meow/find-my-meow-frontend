import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DefaultButton from "./DefaultButton";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id"); // Remove user_id as well
    setUser(null);
    navigate("/");
  };
  

  return (
    <header className="bg-white text-black shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div
          className="flex-shrink-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="src/assets/logo.png" alt="logo" className="w-24" />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => navigate("/")}
            className="text-black hover:text-gray-500 transition duration-300"
          >
            หน้าแรก
          </button>
          <button
            onClick={() => navigate("/lost-cat")}
            className="text-black hover:text-gray-500 transition duration-300"
          >
            ประกาศแมวหาย
          </button>
          <button
            onClick={() => navigate("/found-cat")}
            className="text-black hover:text-gray-500 transition duration-300"
          >
            ประกาศหาเจ้าของ
          </button>
          <button
            onClick={() => navigate("/adopt-cat")}
            className="text-black hover:text-gray-500 transition duration-300"
          >
            ประกาศหาบ้านให้แมว
          </button>
          <button
            onClick={() => navigate("/search-cat")}
            className="text-black hover:text-gray-500 transition duration-300"
          >
            ค้นหาแมวหาย
          </button>
        </nav>

        {/* User Info / Login Button */}
        <div className="hidden md:block font-semibold">
          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/user-profile")}
                className="text-black font-semibold hover:text-gray-500 transition duration-300"
              >
                {user.name}
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <DefaultButton
              title="Login/Register"
              color="primary"
              onClick={() => navigate("/auth/login")}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
