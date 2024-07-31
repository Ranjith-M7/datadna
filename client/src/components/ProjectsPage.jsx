import React from "react";
import Header from "./Header";
import Projects from "./Projects";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import Loader from "./Loader";

function ProjectsPage() {
  return (
    <>
      <Loader />
      <Header />
      <Projects />
      <Footer />
      <ScrollTop />
    </>
  );
}

export default ProjectsPage;
