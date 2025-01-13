import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Navbar from "../components/Navbar";
import LostCat from "../pages/LostCat";
import FoundCat from "../pages/FoundCat";
import LoginPage from "../pages/Auth/Login";

const AppRoutes = () => {
  const location = useLocation();

  const getContainerClass = () => {
    if (location.pathname === "/auth/login") {
      return "";
    }
    return "pt-[8rem] pl-10 pr-10 overflow-y-auto";
  };

  return (
    <>
      <Navbar />
      <div className={getContainerClass()}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lost-cat" element={<LostCat />} />
          <Route path="/found-cat" element={<FoundCat />} />
          <Route path="/adopt-cat" element={<LostCat />} />
          <Route path="/search-cat" element={<LostCat />} />
          <Route path="/contact" element={<LostCat />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
