import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LostCat from "./pages/lostCat";
import FoundCat from "./pages/foundCat";
import Navbar from "./components/Navbar";
// import AdoptCat from "./pages/adoptcat";
// import SearchCat from "./pages/searchcat";
// import Contact from "./pages/contact";
// import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LostCat />} />
        <Route path="/lost-cat" element={<LostCat />} />
        <Route path="/found-cat" element={<FoundCat />} />
        <Route path="/adopt-cat" element={<LostCat />} />
        <Route path="/search-cat" element={<LostCat />} />
        <Route path="/contact" element={<LostCat />} />
      </Routes>
    </Router>
  );
}

export default App;
