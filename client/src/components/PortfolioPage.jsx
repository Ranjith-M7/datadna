import React from "react";
import Header from "./Header";
import Portfolio from "./Portfolio";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import Loader from "./Loader";

function PortfolioPage() {
  return (
    <>
      <Loader />
      <Header />
      <Portfolio />
      <Footer />
      <ScrollTop />
    </>
  );
}

export default PortfolioPage;
