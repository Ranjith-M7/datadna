import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";

const TestimonialFilter = () => {
  const handleButtonClick = async () => {
    const dateRange = document.getElementById("date-range").value;
    const star4 = document.getElementById("4star").checked;
    const star5 = document.getElementById("5star").checked;
    const minWords = document.getElementById("min-words").value;

    const filters = {
      dateRange,
      star4,
      star5,
      minWords,
    };

    try {
      const response = await fetch("http://localhost:5000/fetch-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });
      const data = await response.json();
      console.log(data); // This will log the reviews fetched from Google API

      const successMessage = document.getElementById("success-message");
      successMessage.style.display = "block";
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <>
      <Header />
      <Loader />
      <div className="row justify-content-center my-5 pb-5">
        <div className="col-md-7 text-center heading-section ftco-animate">
          <h2 className="mb-2" style={{ color: "#853f91" }}>
            Trigger Review
          </h2>
          <br></br>
          <select id="date-range" className="mb-3">
            <option value="1">Last one month</option>
            <option value="3">Last three months</option>
            <option value="6">Last six months</option>
            <option value="12">One year</option>
            <option value="24">Two years</option>
          </select>
          <br></br>
          <label>
            <input type="checkbox" id="4star" value="4" /> 4 Star
          </label>
          {" "}
          <label>
            <input type="checkbox" id="5star" value="5" /> 5 Star
          </label>
          <br></br>
          <select id="min-words" className="my-3">
            <option value="20">Minimum 20 words</option>
            <option value="30">Minimum 30 words</option>
            <option value="40">Minimum 40 words</option>
            <option value="50">Minimum 50 words</option>
          </select>
          <br></br>
          <button
            className="styled-button"
            onClick={handleButtonClick}
            style={{
              color: "white",
              backgroundColor: "#853f91",
              borderColor: "#853f91",
            }}
          >
            Fetch and Store Reviews
          </button>
          <div
            id="success-message"
            className="success-message"
            style={{ display: "none", color: "green" }}
          >
            Reviews fetched and stored successfully!
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TestimonialFilter;
