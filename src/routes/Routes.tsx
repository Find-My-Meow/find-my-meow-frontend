import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Navbar from "../components/Navbar";
import LostCat from "../pages/lostCat";
import FoundCat from "../pages/foundCat";
import LoginPage from "../pages/Auth/Login";
import AdoptCat from "../pages/adoptCat";
import NewPost from "../pages/createNewPost";
import SearchPage from "../pages/SearchPage";
import Result from "../pages/resultPage";
import CatDetail from "../pages/catDetail";
import CatDetailEdit from "../pages/catDetailEdit";

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
          <Route path="/adopt-cat" element={<AdoptCat />} />
          <Route path="/search-cat" element={<SearchPage />} />
          <Route path="/contact" element={<LostCat />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/create-newpost" element={<NewPost />} />
          <Route path="/result" element={ <Result />}/>
          <Route path="/cat-detail/:post_id" element={ <CatDetail />}/>
          <Route path="/cat-detail/:post_id/edit" element={ <CatDetailEdit />}/>

        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
