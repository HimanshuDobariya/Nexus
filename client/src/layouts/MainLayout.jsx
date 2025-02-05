import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <>
      <div className="max-screen min-h-screen bg-hero-pattern bg-gray-900">
        <div className="bg-gradient-to-b from-blue-gray-900 to-transparent  w-full h-full absolute top-0 left-0 "></div>
        <div className="max-w-screen-2xl mx-auto">
          <Header />
          <main >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
export default MainLayout;
