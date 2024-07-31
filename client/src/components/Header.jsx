import React, { useEffect, useState } from "react";
import { database } from "../firebase/firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FaUser } from "react-icons/fa";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [topbarData, setTopbarData] = useState({
    address: "",
    email: "",
    note: "",
    socialLinks: {
      facebook: {
        name: "",
        url: "",
      },
      instagram: {
        name: "",
        url: "",
      },
      linkedin: {
        name: "",
        url: "",
      },
      twitter: {
        name: "",
        url: "",
      },
    },
  });

  const [navbarData, setNavbarData] = useState({
    brand: {
      name: "",
    },
    contactInfo: {
      phoneText: "",
      questionText: "",
    },
    searchIcon: {
      path: "",
    },
  });

  // Fetch topbar data from firebase
  useEffect(() => {
    const fetchTopbarData = async () => {
      try {
        const snapshot = await database.ref("topbar").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();

          setTopbarData({
            address: data.address || "",
            email: data.email || "",
            note: data.note || "",
            socialLinks: {
              facebook: {
                name: data.socialLinks.facebook.name || "",
                url: data.socialLinks.facebook.url || "",
              },
              twitter: {
                name: data.socialLinks.twitter.name || "",
                url: data.socialLinks.twitter.url || "",
              },
              linkedin: {
                name: data.socialLinks.linkedin.name || "",
                url: data.socialLinks.linkedin.url || "",
              },
              instagram: {
                name: data.socialLinks.instagram.name || "",
                url: data.socialLinks.instagram.url || "",
              },
            },
          });
        } else {
          console.log("The topbar section data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    fetchTopbarData();
  }, []);

  // Fetch navbar data from firebase
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const snapshot = await database.ref("navbar").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { brand, contactInfo, searchIcon } = data;
          setNavbarData({
            brand: {
              name: brand.name || "",
            },
            contactInfo: {
              phoneText: contactInfo.phoneText || "",
              questionText: contactInfo.questionText || "",
            },
            searchIcon: {
              path: searchIcon.path || "",
            },
          });
        } else {
          console.log("The navbar data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: `, error);
      }
    };
    fetchNavbarData();
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setIsLoggedIn(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };
  return (
    <>
      <div
        style={{
          position: "sticky",
          top: "0",
          zIndex: "100",
        }}
      >
        {/* Topbar Start */}
        <div className="container-fluid bg-dark py-2 topbar">
          <div className="container">
            <div className="d-flex justify-content-between topbar">
              <div className="top-info">
                <small className="me-3 text-white-50">
                  <a href="#">
                    <i className="fas fa-map-marker-alt me-2 text-secondary-color" />
                  </a>
                  {topbarData.address}
                </small>
                <small className="me-3 text-white-50">
                  <a href="#">
                    <i className="fas fa-envelope me-2 text-secondary-color" />
                  </a>
                  {topbarData.email}
                </small>
              </div>
              <div id="note" className="text-secondary-color d-none d-xl-flex">
                <small>{topbarData.note}</small>
              </div>
              <div className="top-link">
                <a
                  href={topbarData.socialLinks.facebook.url}
                  className="bg-light nav-fill btn btn-sm-square rounded-circle"
                >
                  <i className="fab fa-facebook-f text-primary-color" />
                </a>
                <a
                  href={topbarData.socialLinks.twitter.url}
                  className="bg-light nav-fill btn btn-sm-square rounded-circle"
                >
                  <i className="fab fa-twitter text-primary-color" />
                </a>
                <a
                  href={topbarData.socialLinks.instagram.url}
                  className="bg-light nav-fill btn btn-sm-square rounded-circle"
                >
                  <i className="fab fa-instagram text-primary-color" />
                </a>
                <a
                  href={topbarData.socialLinks.linkedin.url}
                  className="bg-light nav-fill btn btn-sm-square rounded-circle me-0"
                >
                  <i className="fab fa-linkedin-in text-primary-color" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Topbar End */}
        {/* Navbar Start */}
        <div className="container-fluid bg-dark" id="nav">
          <div className="container">
            <nav className="navbar navbar-dark navbar-expand-lg py-0">
              <NavLink to="/" className="navbar-brand">
                <h1 className="text-white fw-bold d-block title my-2 text-secondary-color">
                  {navbarData.brand.name}
                </h1>
              </NavLink>
              <button
                type="button"
                className="navbar-toggler me-0"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse bg-transparent "
                id="navbarCollapse"
              >
                <div className="navbar-nav ms-auto mx-xl-auto p-0 text-center">
                  <NavLink
                    to="/"
                    exact
                    activeClassName="active"
                    className="nav-item nav-link text-green"
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/about"
                    activeClassName="active"
                    className="nav-item nav-link"
                  >
                    About Us
                  </NavLink>
                  <NavLink
                    to="/services"
                    activeClassName="active"
                    className="nav-item nav-link"
                  >
                    Services
                  </NavLink>
                  <NavLink
                    to="/projects"
                    activeClassName="active"
                    className="nav-item nav-link"
                  >
                    Projects
                  </NavLink>
                  <div className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      Pages
                    </a>
                    <div className="dropdown-menu rounded">
                      <NavLink to="/blog" className="dropdown-item">
                        Our Blog
                      </NavLink>
                      <NavLink to="/portfolio" className="dropdown-item">
                        Portfolio
                      </NavLink>
                      <NavLink to="/team" className="dropdown-item">
                        Our Team
                      </NavLink>
                      <NavLink to="/testimonial" className="dropdown-item">
                        Testimonial
                      </NavLink>
                      {/*   <NavLink to="/404" className="dropdown-item">
                        404 Page
                      </NavLink> */}
                    </div>
                  </div>
                  <NavLink
                    to="/contact"
                    activeClassName="active"
                    className="nav-item nav-link"
                  >
                    Contact
                  </NavLink>
                  {isLoggedIn ? (
                    <div className="dropdown nav-item pb-3 pb-lg-0 d-flex flex-column justify-conntent-center align-items-center">
                      <button
                        className="btn px-4 dropdown-toggle nav-link"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          outline: "none",
                          boxShadow: "none",
                          border: "none",
                        }}
                      >
                        <FaUser
                          style={{
                            marginRight: "10px",
                            cursor: "pointer",
                            color: "white",
                          }}
                        />
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <li>
                          <NavLink
                            to="/profile"
                            className="dropdown-item"
                            activeClassName="active"
                          >
                            Profile
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/adminpage"
                            className="dropdown-item"
                            activeClassName="active"
                          >
                            Admin Page
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/seo-settings"
                            className="dropdown-item"
                            activeClassName="active"
                          >
                            SEO Settings
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="/blogedit"
                            className="dropdown-item"
                            activeClassName="active"
                          >
                            Blog
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/testimonial-filter"
                            className="dropdown-item"
                            activeClassName="active"
                          >
                            Google Review
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/"
                            className="dropdown-item"
                            activeClassName="active"
                            onClick={handleLogout}
                          >
                            Sign out
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <NavLink
                      to="/auth"
                      className="nav-item nav-link"
                      activeClassName="active"
                    >
                      Sign In
                    </NavLink>
                  )}
                </div>
              </div>
              <div className="d-none d-xl-flex flex-shrink-0">
                <div
                  id="phone-tada"
                  className="d-flex align-items-center justify-content-center me-4"
                >
                  <NavLink
                    to="#"
                    className="position-relative animated tada infinite"
                  >
                    <i
                      className="fa fa-phone-alt text-white fa-2x"
                      style={{ transform: "rotate(90deg)" }}
                    />
                    <div
                      className="position-absolute"
                      style={{ top: "-7px", left: 20 }}
                    >
                      <span>
                        <i className="fa fa-comment-dots text-secondary-color" />
                      </span>
                    </div>
                  </NavLink>
                </div>
                <div className="d-flex flex-column pe-4">
                  <span className="text-white-50">
                    {navbarData.contactInfo.questionText}
                  </span>
                  <span className="text-secondary-color">
                    {navbarData.contactInfo.phoneText}
                  </span>
                </div>
                {/* <div className="d-flex align-items-center justify-content-center ms-4">
                  <NavLink to={navbarData.searchIcon.path}>
                    <i className="fa-solid fa-magnifying-glass text-white fa-2x"></i>
                  </NavLink>
                </div> */}
              </div>
            </nav>
          </div>
        </div>
        {/* Navbar End */}
      </div>
    </>
  );
}

export default Header;
