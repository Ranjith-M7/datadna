import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { database } from "../firebase/firebaseConfig";

function Contact({ mapIsVisible }) {
  const [contactData, setContactData] = useState({
    title: "",
    subtitle: "",
    contacts: {
      address: "",
      email: "",
      openHours: "",
      phoneNumber: "",
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [latestId, setLatestId] = useState(0);
  useEffect(() => {
    const fetchLatestId = async () => {
      try {
        const snapshot = await database
          .ref("Contact Form")
          .orderByChild("Contact_id")
          .limitToLast(1)
          .once("value");
        if (snapshot.exists()) {
          const latestEntry = snapshot.val();
          const latestIdValue = Object.values(latestEntry)[0].Contact_id;
          setLatestId(latestIdValue);
        } else {
          setLatestId(0);
        }
      } catch (error) {
        console.error("Error fetching latest ID:", error);
      }
    };

    fetchLatestId();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const db = database;

    try {
      console.log("Latest ID:", latestId);
      const newId = latestId + 1;
      console.log("New ID:", newId);
      // Push form data to the database
      await db.ref("Contact Form").push({
        Contact_id: newId,
        Contact_name: name,
        Contact_email: email,
        Contact_subject: subject,
        Contact_message: message,
      });

      // Clear form fields and set success message
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast.success(`Message sent successfully`);
    } catch (error) {
      console.error("Error storing form data:", error);
      toast.error(`Failed to send message. Please try again.`);
    }
  };

  // Fetch contact date from firebase database
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const snapshot = await database.ref("Contact Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { title, subtitle, contacts } = data;

          setContactData({
            title: title || "",
            subtitle: subtitle || "",
            contacts: {
              address: contacts.address || "",
              email: contacts.email || "",
              openHours: contacts.openHours || "",
              phoneNumber: contacts.phoneNumber || "",
            },
          });
        } else {
          console.log("The contact data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: `, error);
      }
    };
    fetchContactData();
  }, []);

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="contact section">
        {/* Section Title */}
        <div className="container section-title" data-aos="fade-up">
          <h2>{contactData.title}</h2>
          <p>{contactData.subtitle}</p>
        </div>
        {/* End Section Title */}
        <div className="container" data-aos="fade-up" data-aos-delay={100}>
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="row gy-4">
                <div className="col-md-6">
                  <div
                    className="info-item"
                    data-aos="fade"
                    data-aos-delay={200}
                    style={{ height: "230px" }}
                  >
                    <i className="bi bi-geo-alt" />
                    <h3>{contactData.contacts.address.title}</h3>
                    <p>{contactData.contacts.address.location}</p>
                  </div>
                </div>
                {/* End Info Item */}
                <div className="col-md-6">
                  <div
                    className="info-item"
                    data-aos="fade"
                    data-aos-delay={300}
                    style={{ height: "230px" }}
                  >
                    <i className="bi bi-telephone" />
                    <h3>{contactData.contacts.phoneNumber.title}</h3>
                    <p>{contactData.contacts.phoneNumber.main}</p>
                    <p>{contactData.contacts.phoneNumber.secondary}</p>
                  </div>
                </div>
                {/* End Info Item */}
                <div className="col-md-6">
                  <div
                    className="info-item"
                    data-aos="fade"
                    data-aos-delay={400}
                    style={{ height: "230px" }}
                  >
                    <i className="bi bi-envelope" />
                    <h3>{contactData.contacts.email.title}</h3>
                    <p>{contactData.contacts.email.main}</p>
                    <p>{contactData.contacts.email.secondary}</p>
                  </div>
                </div>
                {/* End Info Item */}
                <div className="col-md-6">
                  <div
                    className="info-item"
                    data-aos="fade"
                    data-aos-delay={500}
                    style={{ height: "230px" }}
                  >
                    <i className="bi bi-clock" />
                    <h3>{contactData.contacts.openHours.title}</h3>
                    <p>{contactData.contacts.openHours.days}</p>
                    <p>{contactData.contacts.openHours.hours}</p>
                  </div>
                </div>
                {/* End Info Item */}
              </div>
            </div>
            <div className="col-lg-6">
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                method="post"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <div className="row gy-4">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      autoComplete="on"
                      className="form-control"
                      placeholder="Your Name"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <div className="col-md-6 ">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      autoComplete="on"
                      placeholder="Your Email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      placeholder="Subject"
                      autoComplete="on"
                      required
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      name="message"
                      rows={6}
                      placeholder="Message"
                      required
                      value={message}
                      defaultValue={""}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                  </div>
                  <div className="col-12 text-center">
                    {/* <div className="loading">Loading</div>
                    <div className="error-message" />
                    <div className="sent-message">
                      Your message has been sent. Thank you!
                    </div> */}
                    <button type="submit" className="btn btn-primary">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-12">
              {mapIsVisible && (
                <iframe
                  className="position-relative rounded shadow"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.6428960658045!2d80.21951977483833!3d12.80167628749832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52510b7ea14dbd%3A0x49b38c5db4767675!2sDataDNA!5e0!3m2!1sen!2sin!4v1715751776232!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
            </div>

            {/* End Contact Form */}
          </div>
        </div>
        <ToastContainer />
      </section>
      {/* /Contact Section */}
    </>
  );
}

export default Contact;
