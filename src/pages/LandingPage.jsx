import Hero3d from "../components/Hero3d";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import NeedHelp from "../components/NeedHelp";
import Blogs from "../components/Blogs";
import DealShowcase from "../components/DealShowcase";
// import PCComponents from "../components/PCComponents"
import TrustedBrands from "../components/TrustedBrands";
import FeaturedProducts from "../components/FeaturedProducts";
import LandingCarousel from "../components/LandingCarousel";
import Testimonials from "../components/LandingTestimonial";
import EmpressNavbar from "../components/EmpressNavbar";
import Footer from "../components/Footer";
import CurvedLoop from "../components/CurvedLoop";
import Test from "./Test";
export default function LandingPage() {
  return (
    <>
      <EmpressNavbar />
      {/* <Test /> */}
      <Hero3d />
      <FeaturedProducts />
      {/* <Categories /> */}
      <ProductGrid />
      <LandingCarousel />
      <DealShowcase />
      <NeedHelp />
      <Blogs />
      <TrustedBrands />
      {/* <PCComponents /> */}
      <Testimonials />
      <Footer />
    </>
  );
}
