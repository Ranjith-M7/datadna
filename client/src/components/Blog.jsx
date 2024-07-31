import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Pagination from "react-js-pagination";
import Loader from "./Loader";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //post
  useEffect(() => {
    const postsRef = firebase.database().ref("posts");
    postsRef.once("value", (snapshot) => {
      const postsData = snapshot.val();
      if (postsData) {
        const postsArray = Object.values(postsData).filter(
          (post) =>
            post.statusUpdate === "Created" || post.statusUpdate === "edited"
        );

        // Sort posts by date in descending order
        postsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        setPosts(postsArray);
        setFilteredPosts(postsArray);
      }
    });
  }, []);

  const handleSearchInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  // pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPosts.length);
  const currentData = filteredPosts.slice(startIndex, endIndex);

  // funtion to parse HTML and extract the text content
  const parseHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };
  return (
    <>
      <Loader />
      <Header />
      <section className="blog-section" id="blog">
        <div className="hero-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <div className="section-title">
                  <h2>BLOG</h2>
                  <p>Our Stories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container ">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by blog..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <section className="blogs">
          <div className="container">
            <div className="row">
              {currentData.map((post, index) => (
                <div key={index} className="col-lg-6">
                  <div className="blog-item mx-5">
                    <div className="row p-5 my-5">
                      <div className="col-lg-6">
                        <div className="blog-image">
                          <img src={post.image} className="img-fluid" alt="" />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="blog-content">
                          <span className="blog-date mb-1">{post.date}</span>
                          <div
                            className="blog-title mb-2"
                            dangerouslySetInnerHTML={{
                              __html: `<Link to="/${post.title.replace(
                                /(<([^>]+)>)/gi,
                                ""
                              )}">${post.title}</Link>`,
                            }}
                          />
                          <div className="blog-description mb-3">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: post.description,
                              }}
                            />
                          </div>
                          <Link
                            to={`/blog/blog-details/${parseHTML(post.title)}`}
                            className="blog-button"
                          >
                            READ MORE
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-center align-items-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={filteredPosts.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          </div>
        </section>
        <br />
      </section>
      <Footer />
    </>
  );
}

export default Blog;
