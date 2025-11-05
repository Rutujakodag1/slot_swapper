import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Requests from "./components/Requests";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Marketplace from "./components/Marketplaces";
function App() {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken");
    return token ? (
      <>
        <Navbar /> {/* Navbar visible only when user is logged in */}
        {children}
      </>
    ) : (
      <Navigate to="/" />
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
        <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
     

      </Routes>
    </Router>
  );
}

export default App;
