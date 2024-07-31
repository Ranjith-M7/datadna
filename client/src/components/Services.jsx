import React, { useState, useEffect } from "react";
import { database, storage } from "../firebase/firebaseConfig";

function Services() {
  const [servicesData, setServicesData] = useState({
    title: "",
    subtitle: "",
    services: [],
  });

  // Fetch Services date from firebase database
  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const snapshot = await database.ref("Services Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { title, subtitle, services } = data;

          setServicesData({
            title: title || "",
            subtitle: subtitle || "",
            services: services || [],
          });
        } else {
          console.log("The services data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: `, error);
      }
    };
    fetchServicesData();
  }, []);

  const colorClasses = [
    "item-cyan",
    "item-orange",
    "item-teal",
    "item-red",
    "item-indigo",
    "item-pink",
  ];

  return (
    <>
      {/* Services Section */}
      <section id="services" className="services section">
        {/* Section Title */}
        <div className="container section-title" data-aos="fade-up">
          <h2>{servicesData.title}</h2>
          <p>
            {servicesData.subtitle}
            <br />
          </p>
        </div>
        {/* End Section Title */}
        <div className="container">
          <div className="row gy-4">
            {servicesData.services.map((item, index) => (
              <div
                key={index}
                className="col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <div
                  className={`service-item ${
                    colorClasses[(index - 1) % colorClasses.length]
                  } position-relative`}
                >
                  <i className={`${item.icon} icon`} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a
                    href={item.button.url}
                    className="read-more stretched-link"
                  >
                    <span>{item.button.text}</span>
                    <i className="bi bi-arrow-right" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
