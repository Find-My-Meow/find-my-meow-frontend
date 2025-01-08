import DefaultButton from "./DefaultButton";

const Navbar = () => {
  return (
    <header className="bg-white text-black shadow-md fixed top-0 left-0 w-full z-10 overflow-hidden">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/">
            <img src="src/assets/logo.png" alt="logo" className="w-24" />
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <a
            href="/"
            className="text-black hover:text-gray-500 transition duration-300"
          >
            หน้าแรก
          </a>
          <a
            href="/lost-cat"
            className="text-black hover:text-gray-500 transition duration-300"
          >
            ประกาศแมวหาย
          </a>
          <a
            href="/found-cat"
            className="text-black hover:text-gray-500 transition duration-300"
          >
            ประกาศหาเจ้าของ
          </a>
          <a
            href="/adopt-cat"
            className="text-black hover:text-gray-500 transition duration-300"
          >
            ประกาศหาบ้านให้แมว
          </a>
          <a
            href="/search-cat"
            className="text-black hover:text-gray-500 transition duration-300"
          >
            ค้นหาแมวหาย
          </a>
          <a
            href="/contact"
            className="text-black hover:text-gray-500 transition duration-300"
          >
            เกี่ยวกับเรา
          </a>
        </nav>

        {/* Login/Register Button */}
        <div className="hidden md:block font-semibold ">
          <DefaultButton title="Login/Register" color="primary" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
