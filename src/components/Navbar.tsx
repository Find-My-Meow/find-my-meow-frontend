import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DefaultButton from "./DefaultButton";

interface User {
  name: string;
  email: string;
  picture?: string; // optional Google avatar
}

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();

    // Listen for login event
    window.addEventListener("userLogin", loadUser);

    return () => {
      window.removeEventListener("userLogin", loadUser);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setUser(null);
    navigate("/");
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <header className="bg-white text-black shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
          <img src="src/assets/logo.png" alt="logo" className="w-24" />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <button onClick={() => navigate("/")} className="hover:text-gray-500 transition duration-300">
            หน้าแรก
          </button>
          <button onClick={() => navigate("/lost-cat")} className="hover:text-gray-500 transition duration-300">
            ประกาศแมวหาย
          </button>
          <button onClick={() => navigate("/found-cat")} className="hover:text-gray-500 transition duration-300">
            ประกาศหาเจ้าของ
          </button>
          <button onClick={() => navigate("/adopt-cat")} className="hover:text-gray-500 transition duration-300">
            ประกาศหาบ้านให้แมว
          </button>
          <button onClick={() => navigate("/search-cat")} className="hover:text-gray-500 transition duration-300">
            ค้นหาแมวหาย
          </button>
        </nav>

        {/* User Info or Login */}
        <div className="hidden md:block font-semibold relative">
          {user ? (
            <div className="relative group flex items-center space-x-2 cursor-pointer">
              <span className="font-medium">{user.name}</span>
              <div className="w-9 h-9 bg-[#FF914D] rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
              </div>


              {/* Dropdown Menu */}
              <div className="absolute top-12 right-0 bg-white shadow-md border rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200 z-20">
                <button
                  onClick={() => navigate("/user-profile")}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                >
                  โปรไฟล์
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm text-red-500"
                >
                  ออกจากระบบ
                </button>
              </div>
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
