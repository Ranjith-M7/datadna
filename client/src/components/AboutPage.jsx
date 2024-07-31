import React from "react";
import Header from "./Header";
import About from "./About";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import Loader from "./Loader";

function AboutPage() {
  return (
    <>
     <Loader />
      <Header />
      <About />
      <Footer />
      <ScrollTop />
    </>
  );
}

export default AboutPage;
