import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { database } from "../firebase/firebaseConfig";

function Testimonial() {
  const [testimonialData, setTestimonialData] = useState([]);

  useEffect(() => {
    const fetchTestimonialData = async () => {
      const testimonialRef = database.ref("reviews");

      try {
        const snapshot = await testimonialRef.once("value");
        const data = snapshot.val();
        // console.log("data:", data);
        const testimonials = Object.values(data).filter(
          (item) => item !== null
        );
        // console.log("testimonials:", testimonials);
        setTestimonialData(testimonials);
      } catch (error) {
        console.error("Error fetching testimonial data:", error);
      }
    };

    fetchTestimonialData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="testimonial section" id="testimonial">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>Testimonials</h2>
        <p>What they are saying about us</p>
      </div>
      {/* End Section Title */}
      <div className="container">
        <div className="row justify-content-center ftco-animate">
          <div className="col-md-12">
            <Slider {...settings}>
              {testimonialData.map((testimonial) => (
                <div
                  key={testimonial.time}
                  className="item"
                  style={{ marginRight: "10px" }}
                >
                  <div
                    className="card"
                    style={{
                      border: "none",
                      boxShadow: "0 4px 8px rgb(133, 63, 145)",
                    }}
                  >
                    <div
                      className="card-body text-center"
                      style={{ height: "350px", overflow: "auto" }}
                    >
                      <h5
                        className="card-title"
                        style={{ fontWeight: "bold", color: "#853f91" }}
                      >
                        {testimonial.author_name}
                      </h5>
                      <p className="card-text mt-1 text-justify">
                        {testimonial.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
