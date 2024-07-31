import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { database } from "../firebase/firebaseConfig";

function Stats() {
  const [statsData, setStatsData] = useState({
    happyClients: {
      text: "",
      numbers: "",
      icon: "",
    },
    hardWorkers: {
      text: "",
      numbers: "",
      icon: "",
    },
    hoursOfSupport: {
      text: "",
      numbers: "",
      icon: "",
    },
    projects: {
      text: "",
      numbers: "",
      icon: "",
    },
  });
  // Fetch stats data from firebase
  useEffect(() => {
    const fetchStatesData = async () => {
      try {
        const snapshot = await database.ref("stats").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { happyClients, hardWorkers, hoursOfSupport, projects } = data;
          setStatsData({
            happyClients: {
              icon: happyClients.icon || "",
              numbers: happyClients.numbers || "",
              text: happyClients.text || "",
            },

            hardWorkers: {
              icon: hardWorkers.icon || "",
              numbers: hardWorkers.numbers || "",
              text: hardWorkers.text || "",
            },
            hoursOfSupport: {
              icon: hoursOfSupport.icon || "",
              numbers: hoursOfSupport.numbers || "",
              text: hoursOfSupport.text || "",
            },
            projects: {
              icon: projects.icon || "",
              numbers: projects.numbers || "",
              text: projects.text || "",
            },
          });
        } else {
          console.log("The stats data were not found in the database");
        }
      } catch (error) {
        console.log(`Error: `, error);
      }
    };
    fetchStatesData();
  }, []);

  return (
    <>
      {/* Stats Section */}
      <section id="stats" className="stats section">
        <div className="container" data-aos="fade-up" data-aos-delay={100}>
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="stats-item d-flex align-items-center w-100 h-100">
                <i
                  className={`${statsData.happyClients.icon} color-blue flex-shrink-0`}
                />
                <div>
                  <CountUp
                    start={0}
                    end={statsData.happyClients.numbers}
                    duration={1}
                    className="purecounter"
                  />
                  <p>{statsData.happyClients.text}</p>
                </div>
              </div>
            </div>
            {/* End Stats Item */}
            <div className="col-lg-3 col-md-6">
              <div className="stats-item d-flex align-items-center w-100 h-100">
                <i
                  className={`${statsData.projects.icon} color-orange flex-shrink-0`}
                  style={{ color: "#ee6c20" }}
                />
                <div>
                  <CountUp
                    start={0}
                    end={statsData.projects.numbers}
                    duration={1}
                    className="purecounter"
                  />
                  <p>{statsData.projects.text}</p>
                </div>
              </div>
            </div>
            {/* End Stats Item */}
            <div className="col-lg-3 col-md-6">
              <div className="stats-item d-flex align-items-center w-100 h-100">
                <i
                  className={`${statsData.hoursOfSupport.icon} color-green flex-shrink-0`}
                  style={{ color: "#15be56" }}
                />
                <div>
                  <CountUp
                    start={0}
                    end={statsData.hoursOfSupport.numbers}
                    duration={1}
                    className="purecounter"
                  />
                  <p>{statsData.hoursOfSupport.text}</p>
                </div>
              </div>
            </div>
            {/* End Stats Item */}
            <div className="col-lg-3 col-md-6">
              <div className="stats-item d-flex align-items-center w-100 h-100">
                <i
                  className={`${statsData.hardWorkers.icon} color-pink flex-shrink-0`}
                  style={{ color: "#bb0852" }}
                />
                <div>
                  <CountUp
                    start={0}
                    end={statsData.hardWorkers.numbers}
                    duration={1}
                    className="purecounter"
                  />
                  <p>{statsData.hardWorkers.text}</p>
                </div>
              </div>
            </div>
            {/* End Stats Item */}
          </div>
        </div>
      </section>
      {/* /Stats Section */}
    </>
  );
}

export default Stats;
