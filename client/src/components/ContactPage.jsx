import React from "react";
import Header from "./Header";

import Contact from "./Contact";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import Loader from "./Loader";

function ContactPage() {
  return (
    <>
      <Loader />
      <Header />
      <Contact isVisible={true} />
      <Footer />
      <ScrollTop />
    </>
  );
}

export default ContactPage;
