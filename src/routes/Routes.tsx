import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Navbar from "../components/Navbar";
import LostCat from "../pages/lostCat";
import FoundCat from "../pages/foundCat";

const AppRoutes = () => {
  return (
    <>
      <div className="relative">
        <Navbar />
        <div className="overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lost-cat" element={<LostCat />} />
            <Route path="/found-cat" element={<FoundCat />} />
            <Route path="/adopt-cat" element={<LostCat />} />
            <Route path="/search-cat" element={<LostCat />} />
            <Route path="/contact" element={<LostCat />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default AppRoutes;
