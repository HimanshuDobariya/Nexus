import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="max-w-screen-xl mx-auto bg-white">
      <Header />
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};
export default MainLayout;
