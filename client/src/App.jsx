import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Marketplace from "./pages/Marketplace";
import Events from "./pages/Events";
import ProductDetail from "./pages/ProductDetail";
import MyProfile from "./pages/MyProfile";
import Admin from "./pages/Admin";
import PrivateComponent from "./components/PrivateComponent";
import NotFound from "./pages/NotFound";
import PageNotFound from "./pages/PageNotFound";
import EventDetail from "./pages/EventDetail";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider> 
    <ThemeProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateComponent />}>
          <Route path="marketplace/:pid" element={<ProductDetail />} />
          <Route path="/event/:eid" element={<EventDetail />} />
        </Route>
        <Route path="/auth" element={<PrivateComponent />}>
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:pid" element={<ProductDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="event/:eid" element={<EventDetail />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
    </ThemeProvider>
    </AuthProvider>
  );
};


export default App;
