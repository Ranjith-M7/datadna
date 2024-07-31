import React, { useEffect, useState } from "react";
import { database, storage } from "../firebase/firebaseConfig";

function MainCarousel() {
  const [carouselData, setCarouselData] = useState([]);
  const [dataloaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const snapshot = await database.ref("Main Carousel").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert object into an array
          const carouselArray = Object.values(data);

          // Fetch images for each carousel item
          const carouselWithImages = await Promise.all(
            carouselArray.map(async (item) => {
              const imagesRef = storage.ref(`Main Carousel Images/${item.id}`);
              const imagesSnapshot = await imagesRef.listAll();
              const imagesUrls = await Promise.all(
                imagesSnapshot.items.map(async (imageRef) => {
                  const url = await imageRef.getDownloadURL();
                  return url;
                })
              );

              return {
                ...item,
                images: imagesUrls,
              };
            })
          );

          setCarouselData(carouselWithImages);
          setDataLoaded(true);
        } else {
          console.log("The carousel data was not found in the database");
        }
      } catch (error) {
        console.log("Error fetching carousel data:", error);
      }
    };
    fetchCarouselData();
  }, []);

  return (
    <>
      {/* Carousel Start */}
      <div className="container-fluid px-0 main-carousel">
        {dataloaded && (
          <div
            id="carouselId"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <ol className="carousel-indicators" style={{ listStyle: "none" }}>
              {carouselData.map((_, index) => (
                <li
                  key={index}
                  data-bs-target="#carouselId"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : undefined}
                  aria-label={`Slide ${index + 1}`}
                ></li>
              ))}
            </ol>
            <div className="carousel-inner" role="listbox">
              {carouselData.map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  {item.images.map((url, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={url}
                      className="img-fluid"
                      alt={`Carousel ${item.id} - Image ${imgIndex}`}
                    />
                  ))}
                  <div className="carousel-caption">
                    <div className="container carousel-content">
                      <h6 className="text-secondary-color h4 animated fadeInUp">
                        {item.title}
                      </h6>
                      <h1 className="text-white display-1 mb-4 animated fadeInRight fw-bold">
                        {item.subtitle}
                      </h1>
                      <p className="mb-4 text-white fs-5 animated fadeInDown">
                        {item.description}
                      </p>
                      <div className="buttons">
                        <a
                          href={item.buttons.button1.url}
                          className="px-4 py-sm-3 px-sm-5 btn rounded-pill carousel-content-btn1 animated fadeInLeft fw-medium mx-2 my-1"
                        >
                          {item.buttons.button1.text}
                        </a>
                        <a
                          href={item.buttons.button2.url}
                          className="px-4 py-sm-3 px-sm-5 btn rounded-pill carousel-content-btn2 animated fadeInRight fw-medium mx-2 my-1"
                        >
                          {item.buttons.button2.text}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselId"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-ico"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselId"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Carousel End */}
    </>
  );
}

export default MainCarousel;
