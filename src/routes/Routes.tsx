import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Navbar from "../components/Navbar";
import LostCat from "../pages/LostCat";
import FoundCat from "../pages/FoundCat";
import LoginPage from "../pages/Auth/Login";
import AdoptCat from "../pages/AdoptCat";
import NewPost from "../pages/CreateNewPost";
import SearchPage from "../pages/SearchPage";
import Result from "../pages/ResultPage";
import CatDetail from "../pages/CatDetail";
import CatDetailEdit from "../pages/CatDetailEdit";
import UserProfile from "../pages/UserProfile";
import { LoadScript } from "@react-google-maps/api";
import NotFound from "../pages/NotFound";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem("user_id");

  if (!user) {
    console.warn("User not authenticated. Redirecting to login...");
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

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
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        loadingElement={<div style={{ display: "none" }} />}
        libraries={["places"]}
      >
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
            <Route
              path="/create-newpost"
              element={
                <PrivateRoute>
                  <NewPost />
                </PrivateRoute>
              }
            />
            <Route path="/result" element={<Result />} />
            <Route
              path="/cat-detail/:post_id"
              element={
                <PrivateRoute>
                  <CatDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/cat-detail/:post_id/edit"
              element={
                <PrivateRoute>
                  <CatDetailEdit />
                </PrivateRoute>
              }
            />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </LoadScript>
    </>
  );
};

export default AppRoutes;
