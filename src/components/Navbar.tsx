const Navbar = () => {
    return (
      <header className="bg-white text-black shadow-md fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <a href="/">MyApp</a>
          </div>
  
          {/* Navigation Links */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
            <a
              href="/"
              className="text-black hover:text-gray-300 transition duration-300"
            >
              หน้าแรก
            </a>
            <a
              href="/lost-cat"
              className="text-black hover:text-gray-300 transition duration-300"
            >
              ประกาศแมวหาย
            </a>
            <a
              href="/found-cat"
              className="text-black hover:text-gray-300 transition duration-300"
            >
              ประกาศหาเจ้าของ
            </a>
            <a
              href="/adopt-cat"
              className="text-black hover:text-gray-300 transition duration-300"
            >
              ประกาศหาบ้านให้แมว
            </a>
            <a
              href="/search-cat"
              className="text-black hover:text-gray-300 transition duration-300"
            >
              ค้นหาแมวหาย
            </a>
            <a
              href="/contact"
              className="text-black hover:text-gray-300 transition duration-300"
            >
              เกี่ยวกับเรา
            </a>
          </nav>
        </div>
      </header>
    );
  };
  
  export default Navbar;
  