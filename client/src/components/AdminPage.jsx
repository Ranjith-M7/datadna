import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";
function AdminPage() {
  return (
    <>
     <Loader />
      <Header />
      <h1 className="text-center my-5">AdminPage</h1>
      <Footer />
    </>
  );
}

export default AdminPage;
