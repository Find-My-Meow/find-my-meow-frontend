import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import AppRoutes from "./routes/Routes";
import "./index.css";
import SearchProvider from "./context/SearchProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <AppRoutes />
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
