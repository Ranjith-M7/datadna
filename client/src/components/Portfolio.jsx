import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import Isotope from "isotope-layout";
import imagesLoaded from "imagesloaded";
import AOS from "aos";
import "aos/dist/aos.css";
import "isotope-layout/dist/isotope.pkgd.min.js";
import "glightbox/dist/css/glightbox.min.css";
import GLightbox from "glightbox";
import { database } from "../firebase/firebaseConfig"; // Adjust the path as necessary

function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [sectionData, setSectionData] = useState({
    title: "",
    subtitle: "",
  });

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const snapshot = await database.ref("Portfolio Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          setSectionData({
            title: data.title || "",
            subtitle: data.subtitle || "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSectionData();
  }, []);

  useEffect(() => {
    const portfolioRef = ref(database, "Portfolio Section/portfolios");
    onValue(portfolioRef, async (snapshot) => {
      const data = snapshot.val();
      setPortfolioData(data);

      const storage = getStorage();
      const urls = {};
      const items = data.portfolioItems;

      for (const key in items) {
        const itemId = items[key].id;
        const folderRef = storageRef(
          storage,
          `Portfolio Items Images/${itemId}`
        );

        const listResponse = await listAll(folderRef);
        if (listResponse.items.length > 0) {
          const imgRef = listResponse.items[0]; // Get the first image in the folder
          const url = await getDownloadURL(imgRef);
          urls[itemId] = url;
        }
      }
      setImageUrls(urls);
    });
  }, []);

  useEffect(() => {
    if (portfolioData && Object.keys(imageUrls).length > 0) {
      initializeIsotope();
      GLightbox({
        selector: ".glightbox",
      });
    }
  }, [portfolioData, imageUrls]);

  const initializeIsotope = () => {
    AOS.init({ duration: 1000, once: true });
    const isotopeLayouts = document.querySelectorAll(".isotope-layout");
    isotopeLayouts.forEach((isotopeItem) => {
      let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
      let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
      let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

      imagesLoaded(isotopeItem.querySelector(".isotope-container"), () => {
        const initIsotope = new Isotope(
          isotopeItem.querySelector(".isotope-container"),
          {
            itemSelector: ".isotope-item",
            layoutMode: layout,
            filter: filter,
            sortBy: sort,
          }
        );

        isotopeItem
          .querySelectorAll(".isotope-filters li")
          .forEach((filterElement) => {
            filterElement.addEventListener("click", function () {
              isotopeItem
                .querySelector(".isotope-filters .filter-active")
                .classList.remove("filter-active");
              this.classList.add("filter-active");
              initIsotope.arrange({
                filter: this.getAttribute("data-filter"),
              });
              if (typeof AOS.refresh === "function") {
                AOS.refresh();
              }
            });
          });
      });
    });
  };

  return (
    <>
      {portfolioData ? (
        <section id="portfolio" className="portfolio section">
          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>{sectionData.title}</h2>
            <p>{sectionData.subtitle}</p>
          </div>
          {/* End Section Title */}
          <div className="container">
            <div
              className="isotope-layout"
              data-default-filter="*"
              data-layout="masonry"
              data-sort="original-order"
            >
              <ul
                className="portfolio-filters isotope-filters"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                {Object.keys(portfolioData.portfolioFilters).map((key) => (
                  <li
                    key={key}
                    data-filter={portfolioData.portfolioFilters[key].filter}
                    className={key === "filter1" ? "filter-active" : ""}
                  >
                    {portfolioData.portfolioFilters[key].name}
                  </li>
                ))}
              </ul>
              {/* End Portfolio Filters */}
              <div
                className="row gy-4 isotope-container"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                {Object.keys(portfolioData.portfolioItems).map((key) => (
                  <div
                    key={key}
                    className={`col-lg-4 col-md-6 portfolio-item isotope-item ${portfolioData.portfolioItems[key].filter}`}
                  >
                    <div className="portfolio-content h-100">
                      <img
                        src={
                          imageUrls[portfolioData.portfolioItems[key].id] ||
                          "placeholder-image.jpg"
                        }
                        className="img-fluid"
                        alt=""
                      />
                      <div className="portfolio-info">
                        <h4>{portfolioData.portfolioItems[key].title}</h4>
                        <p>{portfolioData.portfolioItems[key].description}</p>
                        <a
                          href={
                            imageUrls[portfolioData.portfolioItems[key].id] ||
                            "placeholder-image.jpg"
                          }
                          title={portfolioData.portfolioItems[key].title}
                          data-gallery={`portfolio-gallery-${portfolioData.portfolioItems[key].filter}`}
                          className="glightbox preview-link"
                        >
                          <i className="bi bi-zoom-in" />
                        </a>
                        <a
                          href="#"
                          title="More Details"
                          className="details-link"
                        >
                          <i className="bi bi-link-45deg" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* End Portfolio Container */}
            </div>
          </div>
        </section>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default Portfolio;
