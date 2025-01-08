import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Navbar";
import LostCat from "./pages/lostCat";
import FoundCat from "./pages/foundCat";
// import AdoptCat from "./pages/adoptcat";
// import SearchCat from "./pages/searchcat";
// import Contact from "./pages/contact";
// import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Header />
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
