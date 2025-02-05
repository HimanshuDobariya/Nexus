import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/public/Home";
import AuthLayout from "./layouts/AuthLayout";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
