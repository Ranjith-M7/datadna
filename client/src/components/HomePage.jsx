import React from "react";
import Header from "./Header";
import About from "./About";
import Stats from "./Stats";
import Services from "./Services";
import Projects from "./Projects";
import Portfolio from "./Portfolio";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import MainCarousel from "./MainCarousel";

import Loader from "./Loader";

function HomePage() {
  return (
    <>
      <Loader />
      <Header />
      <MainCarousel />
      <Stats />
      <About />
      <Services />
      <Projects />
      <Portfolio />
      <Contact mapIsVisible={false} />
      <Footer />
      <ScrollTop />
    </>
  );
}

export default HomePage;
