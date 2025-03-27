import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DefaultButton from "./DefaultButton";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

interface User {
  name: string;
  email: string;
  picture?: string; // optional Google avatar
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    return () => window.removeEventListener("userLogin", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateAndClose = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="bg-white text-black shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div
          className={`hover:text-gray-500 ${
            location.pathname === "/" ? "text-[#FF914D] font-bold" : ""
          }`}
          onClick={() => navigate("/")}
        >
          <img src="src/assets/logo.png" alt="logo" className="w-24" />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <button onClick={() => navigate("/")} className="hover:text-gray-500">
            หน้าแรก
          </button>
          <button
            onClick={() => navigate("/lost-cat")}
            className="hover:text-gray-500"
          >
            ประกาศแมวหาย
          </button>
          <button
            onClick={() => navigate("/found-cat")}
            className="hover:text-gray-500"
          >
            ประกาศหาเจ้าของ
          </button>
          <button
            onClick={() => navigate("/adopt-cat")}
            className="hover:text-gray-500"
          >
            ประกาศหาบ้านให้แมว
          </button>
          <button
            onClick={() => navigate("/search-cat")}
            className="hover:text-gray-500"
          >
            ค้นหาแมวหาย
          </button>
        </nav>

        {/* User Section */}
        <div className="hidden md:block font-semibold relative">
          {user ? (
            <div className="relative group flex items-center space-x-2 cursor-pointer">
              <span className="mr-2 font-medium text-[#FF914D]">
                {user.name}
              </span>
              <FaUserCircle className="text-2xl text-[#FF914D] w-9 h-9" />
              {/* Dropdown */}
              <div className="absolute top-12 right-0 bg-white shadow-md border rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200 z-20">
                <button
                  onClick={() => navigate("/user-profile")}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-lg"
                >
                  โปรไฟล์
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-lg text-red-500"
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

        {/* Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t font-medium py-4">
          <button
            onClick={() => navigateAndClose("/")}
            className="block w-full text-left px-6 py-3 hover:bg-gray-100"
          >
            หน้าแรก
          </button>
          <button
            onClick={() => navigateAndClose("/lost-cat")}
            className="block w-full text-left px-6 py-3 hover:bg-gray-100"
          >
            ประกาศแมวหาย
          </button>
          <button
            onClick={() => navigateAndClose("/found-cat")}
            className="block w-full text-left px-6 py-3 hover:bg-gray-100"
          >
            ประกาศหาเจ้าของ
          </button>
          <button
            onClick={() => navigateAndClose("/adopt-cat")}
            className="block w-full text-left px-6 py-3 hover:bg-gray-100"
          >
            ประกาศหาบ้านให้แมว
          </button>
          <button
            onClick={() => navigateAndClose("/search-cat")}
            className="block w-full text-left px-6 py-3 hover:bg-gray-100"
          >
            ค้นหาแมวหาย
          </button>

          <div className="border-t mt-2 pt-3">
            {user ? (
              <>
                <div className="px-6 py-2 font-normal text-gray-600">
                  {user.name}
                </div>
                <button
                  onClick={() => navigateAndClose("/user-profile")}
                  className="block w-full text-left px-6 py-3 hover:bg-gray-100 text-sm"
                >
                  โปรไฟล์
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-6 py-3 text-sm text-red-500 hover:bg-gray-100"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <DefaultButton
                title="Login/Register"
                color="primary"
                onClick={() => navigateAndClose("/auth/login")}
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
