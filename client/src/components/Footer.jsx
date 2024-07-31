import React, { useState, useEffect } from "react";
import { database } from "../firebase/firebaseConfig";

function Footer() {
  const [footerData, setFooterData] = useState({
    newsletter: {
      title: "",
      description: "",
    },
    brand: {
      name: "",
      url: "",
    },
    address: "",
    phoneNumber: {
      label: "",
      number: "",
    },
    emailId: {
      label: "",
      email: "",
    },
    usefulLinks: {
      title: "",
      links: [],
    },
    ourServices: {
      title: "",
      services: [],
    },
    social: {
      title: "",
      description: "",
      socialLinks: {
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
      },
    },
    credits: {
      brand: {
        name: "",
        url: "",
      },
      copyrightText: "",
      rightsText: "",
    },
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const snapshot = await database.ref("Footer Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          setFooterData(data);
        } else {
          console.log("The footer data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: `, error);
      }
    };
    fetchFooterData();
  }, []);

  return (
    <>
      <footer id="footer" className="footer">
        <div className="footer-newsletter">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-6">
                <h4>{footerData.newsletter.title}</h4>
                <p>{footerData.newsletter.description}</p>
                <form
                  action="forms/newsletter.php"
                  method="post"
                  className="php-email-form"
                >
                  <div className="newsletter-form">
                    <input type="email" name="email" placeholder="Your Email" />
                    <input type="submit" defaultValue="Subscribe" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="container footer-top">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 footer-about text-center text-md-start">
              <a
                href={footerData.brand.url}
                className="d-flex align-items-center justify-content-center justify-content-md-start"
              >
                <span className="sitename fw-bold">
                  {footerData.brand.name}
                </span>
              </a>
              <div className="footer-contact pt-3">
                <p>{footerData.address}</p>
                <p className="mt-3">
                  <strong>{footerData.phoneNumber.label}</strong>{" "}
                  <span>{footerData.phoneNumber.number}</span>
                </p>
                <p>
                  <strong>{footerData.emailId.label}</strong>{" "}
                  <span>{footerData.emailId.email}</span>
                </p>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 footer-links text-center text-md-start">
              <h4>{footerData.usefulLinks.title}</h4>
              <ul>
                {footerData.usefulLinks.links.map((link, index) => (
                  <li
                    key={index}
                    className="d-flex justify-content-center justify-content-md-start"
                  >
                    <i className="bi bi-chevron-right" />
                    <a href={link.url}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 footer-links text-center text-md-start">
              <h4>{footerData.ourServices.title}</h4>
              <ul>
                {footerData.ourServices.services.map((service, index) => (
                  <li
                    key={index}
                    className="d-flex justify-content-center justify-content-md-start"
                  >
                    <i className="bi bi-chevron-right" />{" "}
                    <a href={service.url}>{service.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-4 col-md-4 text-center text-md-start">
              <h4>{footerData.social.title}</h4>
              <p>{footerData.social.description}</p>
              <div className="social-links d-flex justify-content-center justify-content-md-start">
                <a href={footerData.social.socialLinks.twitter}>
                  <i className="bi bi-twitter-x" />
                </a>
                <a href={footerData.social.socialLinks.facebook}>
                  <i className="bi bi-facebook" />
                </a>
                <a href={footerData.social.socialLinks.instagram}>
                  <i className="bi bi-instagram" />
                </a>
                <a href={footerData.social.socialLinks.linkedin}>
                  <i className="bi bi-linkedin" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="container copyright text-center mt-4">
          <div className="credits">
            <span>
              {footerData.credits.copyrightText}{" "}
              <a href={footerData.credits.brand.url}>
                {footerData.credits.brand.name}
              </a>
              . {footerData.credits.rightsText}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
