import { Outlet } from "react-router-dom";
import HomeHeader from "../components/Homepages/HomeHeader";
import ScrollTop from "../utils/ScrollToTop";
import HomeFooter from "../components/Homepages/HomeFooter";

export default function HomeLayout() {
  return (
    <div>
      <HomeHeader />
      <ScrollTop />
      <Outlet />
      <HomeFooter />
    </div>
  );
}
