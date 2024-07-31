import React from "react";
import Header from "./Header";
import Services from "./Services";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import Loader from "./Loader";

function ServicesPage() {
  return (
    <>
     <Loader />
      <Header />
      <Services />
      <Footer />
      <ScrollTop />
    </>
  );
}

export default ServicesPage;
