import React, { useState, useEffect } from "react";
import { database, storage } from "../firebase/firebaseConfig";

function Projects() {
  const [projectsSectionData, setProjectsSectionData] = useState({
    title: "",
    desc: "",
    projects: [],
  });
  const [dataloaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchProjectsSectionData = async () => {
      try {
        const snapshot = await database.ref("Projects Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { title, subtitle, projects } = data;
          const projectsArray = Object.values(projects);

          const projectsWithImages = await Promise.all(
            projectsArray.map(async (item) => {
              const imagesRef = storage.ref(`Projects Images/${item.id}`);
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

          setProjectsSectionData({
            title: title || "",
            subtitle: subtitle || "",
            projects: projectsWithImages || [],
          });
          setDataLoaded(true);
        } else {
          console.log(
            "The projects section data was not found in the database"
          );
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchProjectsSectionData();
  }, []);

  return (
    <>
      <div className="container-fluid project py-5 mb-5">
        <div className="container section-title" data-aos="fade-up">
          <h2>{projectsSectionData.title}</h2>
          <p>{projectsSectionData.subtitle}</p>
        </div>
        <div className="container">
          <div className="row g-5">
            {dataloaded &&
              projectsSectionData.projects.map((project, index) => (
                <div
                  key={project.id}
                  className="col-md-6 col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay={((index) % 3) * 200 + 300}
                >
                  <div className="project-item">
                    <div className="project-img">
                      <img
                        src={project.images[0]}
                        className="img-fluid w-100 rounded"
                        alt={project.title}
                      />
                      <div className="project-content">
                        <a href="#" className="text-center">
                          <h4 className="text-secondary-color">
                            {project.title}
                          </h4>
                          <p className="m-0 text-white">
                            {project.category}
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
