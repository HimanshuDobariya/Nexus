import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/public/Home"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          
          <Route path="/"  element={<Home /> } />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
