import React, { useState, useEffect } from "react";
import { database, storage } from "../firebase/firebaseConfig";

function About() {
  const [aboutImage, setAboutImage] = useState(null);
  const [aboutData, setAboutData] = useState({
    title: "",
    subtitle: "",
    content: {
      title: "",
      subtitle: "",
      description: "",
      button: {
        text: "",
        url: "",
      },
    },
  });

  // read more/ read less
  const [isExpended, setIsExpended] = useState(false);
  const handleToggle = () => {
    setIsExpended(!isExpended);
  };

  // Fetch About image from firebase storage
  useEffect(() => {
    const fetchAboutImage = async () => {
      try {
        const listRef = storage.ref("About Image");
        const result = await listRef.listAll();
        const imageUrls = await Promise.all(
          result.items.map(async (itemRef) => {
            const imageUrl = await itemRef.getDownloadURL();
            return imageUrl;
          })
        );
        setAboutImage(imageUrls);
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchAboutImage();
  }, []);

  // Fetch About date from firebase database
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const snapshot = await database.ref("About Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { title, subtitle, content } = data;
          setAboutData({
            title: title,
            subtitle: subtitle,
            content: {
              title: content.title || "",
              subtitle: content.subtitle || "",
              description: content.description || "",
              button: {
                text: content.button.text || "",
                url: content.button.url || "",
              },
            },
          });
        } else {
          console.log("The about data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: `, error);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <>
      {/* About Section */}
      <section id="about" className="about section">
        {/* Section Title */}
        <div className="container section-title" data-aos="fade-up">
          <h2>{aboutData.title}</h2>
          <p>{aboutData.subtitle}</p>
        </div>
        {/* End Section Title */}

        <div className="container" data-aos="fade-up">
          <div className="row gx-0">
            <div
              className="col-lg-6 d-flex flex-column justify-content-center"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              <div className="content">
                <h3>{aboutData.content.title}</h3>
                <h2>{aboutData.content.subtitle}</h2>
                <p>
                  {aboutData.content.description.substring(0, 200)}
                  <span
                    id="dots"
                    style={{ display: isExpended ? "none" : "inline" }}
                  >
                    ...
                  </span>
                  <span
                    id="more"
                    style={{ display: isExpended ? "inline" : "none" }}
                  >
                    {aboutData.content.description.substring(200)}
                  </span>
                </p>
                <a onClick={handleToggle} className="btn-read-more">
                  {isExpended ? "Read less" : "Read more"}
                </a>
                {/* <p>{aboutData.content.description}</p> */}
                {/* <div className="text-center text-lg-start">
                  <a
                    href={`${aboutData.content.button.url}`}
                    className="btn-read-more d-inline-flex align-items-center justify-content-center align-self-center"
                  >
                    <span>{aboutData.content.button.text}</span>
                    <i className="bi bi-arrow-right" />
                  </a>
                </div> */}
              </div>
            </div>
            <div
              className="col-lg-6 d-flex align-items-center"
              data-aos="zoom-out"
              data-aos-delay={200}
            >
              <img src={aboutImage} className="img-fluid" alt="" />
            </div>
          </div>
        </div>
      </section>
      {/* /About Section */}
    </>
  );
}

export default About;
