import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { database, storage } from "../firebase/firebaseConfig";
import Header from "./Header";
import Footer from "./Footer";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = firebase.database().ref("users/" + userId);

      // Fetch user data from the Realtime Database
      userRef.once(
        "value",
        (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setEmail(userData.email || "");
            setAge(userData.age || "");
            setPhoneNumber(userData.phoneNumber || "");
            setGender(userData.gender || "");
            setLocation(userData.location || "");
          } else {
            toast.error(`User data not found`);
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
          toast.error(`Error fetching user data`);
        }
      );
    } else {
      toast.error(`User not authenticated`);
    }
  }, []);
  useEffect(() => {
    // Store form data in localStorage
    localStorage.setItem(
      "profileFormData",
      JSON.stringify({
        firstName,
        lastName,
        email,
        age,
        phoneNumber,
        gender,
        location,
      })
    );
  }, [firstName, lastName, email, age, phoneNumber, gender, location]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const userId = firebase.auth().currentUser.uid;
    const userRef = firebase.database().ref("users/" + userId);

    userRef
      .update({
        firstName,
        lastName,
        email: email,
        age,
        phoneNumber,
        gender,
        location,
      })
      .then(() => {
        toast.success(`Profile updated successfully`);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error(`Error updating profile`);
      });
  };

  // phone number validation
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Allow only digits, spaces, and the '+' symbol
    if (/^[+\d\s]*$/.test(value)) {
      setPhoneNumber(value);
      // Validate the length (8 to 15 characters)
      setIsPhoneNumberValid(value.length >= 8 && value.length <= 15);
    }
  };

  return (
    <>
     <Loader />
      <Header />
      {/* Profile details start */}
      <div>
        <section className="ftco-section section profile-section" id="profile">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <div className="section-title">
                  <h2 className="heading">My Profile</h2>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-md-6">
                <div className="form_container">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="form-group1 mb-3">
                      <label htmlFor="firstName">First Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="form-group1 mb-3">
                      <label htmlFor="lastName">Last Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="form-group1 mb-3">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group1 mb-3">
                      <label htmlFor="age">Age:</label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        value={age}
                        min="0"
                        pattern="[0-9]*"
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div className="form-group1 mb-3">
                      <label htmlFor="pphoneNumber">Phone Number:</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        pattern="[+\d\s]{8,15}"
                        maxLength={15}
                      />
                      {!isPhoneNumberValid && (
                        <div className="text-danger">
                          Phone number should be between 8 and 15 characters
                          long
                        </div>
                      )}
                    </div>
                    <div className="form-group1 mb-3">
                      <label>Gender:</label>
                      <div className="radio-container">
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                          checked={gender === "male"}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <label htmlFor="male" className="radio-label ms-2">
                          Male
                        </label>
                      </div>
                      <div className="radio-container">
                        <input
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                          checked={gender === "female"}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <label htmlFor="female" className="radio-label ms-2">
                          Female
                        </label>
                      </div>
                    </div>
                    <div className="form-group1 mb-3">
                      <label htmlFor="location">Location:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary">
                      Update Profile
                    </button>
                  </form>
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      {/* Profile details end */}
    </>
  );
}

export default Profile;
