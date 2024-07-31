import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";
import { storage } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import { Card, Form, Button, Container, Modal, Alert } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Header from "./Header";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { post } from "jquery";
import Loader from "./Loader";

function BlogEdit() {
  //post blog
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
    link: "",
    postbrand: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Upload image to Firebase Storage if imageFile exists and newPost.title is defined
    if (imageFile && newPost.title) {
      const fileExtension = imageFile.name.split(".").pop(); // Extract file extension
      const imageName = `image_${Date.now()}.${fileExtension}`; // Generate a unique image name
      const imagePath = `images/${newPost.title}/${imageName}`; // Construct the path with dynamic extension
      const uploadTask = storage.ref(imagePath).put(imageFile); // Uploading to the specified path

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function if needed
        },
        (error) => {
          console.error(error);
          setFailureMessage("Failed to upload image."); // Set failure message
        },
        () => {
          // Completion function
          storage
            .ref(`images/${newPost.title}`)
            .child(imageName)
            .getDownloadURL()
            .then((url) => {
              // Prepare the new post object with image URL and other details
              const postToAdd = {
                ...newPost,
                id: "", // Will be assigned after fetching latest ID
                image: url,
                date: formattedDate,
                tags: tags,
                category: categories,
                statusUpdate: "Created",
              };

              // Fetch the latest ID from the database
              firebase
                .database()
                .ref("posts")
                .once("value", (snapshot) => {
                  let latestId = 0;
                  const postsData = snapshot.val();

                  if (postsData) {
                    // Find the latest ID
                    Object.keys(postsData).forEach((postId) => {
                      const id = postsData[postId].id;
                      if (id > latestId) {
                        latestId = id;
                      }
                    });
                  }

                  // Assign the new ID for the next post
                  const newId = latestId + 1;
                  postToAdd.id = newId;

                  // Add post to the database
                  firebase
                    .database()
                    .ref("posts")
                    .push(postToAdd)
                    .then(() => {
                      // Reset form fields and state variables upon successful post addition
                      setNewPost({
                        title: "",
                        description: "",
                        image: "",
                        author: "",
                        date: "",
                        postbrand: "",
                      });
                      setImageFile(null);
                      setTags([]);
                      setCategories([]);
                      setSuccessMessage("Post added successfully."); // Set success message
                      toast.success(`Post added successfully.`);
                    })
                    .catch((error) => {
                      console.error(error);
                      setFailureMessage("Failed to add post."); // Set failure message
                      toast.error(`Failed to add post.`);
                    });
                });
            })
            .catch((error) => {
              console.error(error);
              setFailureMessage("Failed to fetch image URL."); // Set failure message
            });
        }
      );
    } else {
      // If no image is uploaded, add post to database without image
      const postToAdd = {
        ...newPost,
        id: "", // Will be assigned after fetching latest ID
        statusUpdate: "Pending",
        date: formattedDate,
        tags: tags,
        category: categories,
      };

      // Fetch the latest ID from the database
      firebase
        .database()
        .ref("posts")
        .once("value", (snapshot) => {
          let latestId = 0;
          const postsData = snapshot.val();

          if (postsData) {
            // Find the latest ID
            Object.keys(postsData).forEach((post) => {
              const id = post.id;
              if (id > latestId) {
                latestId = id;
              }
            });
          }

          // Assign the new ID for the next post
          const newId = latestId + 1;
          postToAdd.id = newId;

          // Add post to the database
          firebase
            .database()
            .ref("posts")
            .push(postToAdd)
            .then(() => {
              // Reset form fields and state variables upon successful post addition
              setNewPost({
                title: "",
                description: "",
                image: "",
                author: "",
                date: "",
                postbrand: "",
              });
              setTags([]);
              setCategories([]);
              setSuccessMessage("Post added successfully.");
              toast.success(`Post added successfully.`);
            })
            .catch((error) => {
              console.error(error);
              setFailureMessage("Failed to add post.");
              toast.error(`Failed to add post.`);
            });
        });
    }
  };

  const [showEditor, setShowEditor] = useState(false);

  const handleOKClick = () => {
    setShowEditor(false); // Close the editor modal upon clicking OK
  };

  const handleEditorChange = (value) => {
    setNewPost({ ...newPost, description: value }); // Update the description in the state as the user edits
  };

  const handleDescriptionClick = () => {
    setShowEditor(true); // Open the editor modal when description input field is clicked
  };
  //modal editor2

  const [showEditor2, setShowEditor2] = useState(false);

  const handleDescriptionClick1 = () => {
    setShowEditor2(true); // Open the editor modal when description input field is clicked
  };

  const handleEditorChange2 = (value) => {
    setNewPost({ ...newPost, postbrand: value }); // Update the description in the state as the user edits
  };

  const handleEditorChangeOpen = (value) => {
    setNewPost({ ...newPost, title: value }); // Update the description in the state as the user edits
  };

  const handleOKClick2 = () => {
    setShowEditor2(false); // Close the editor modal upon clicking OK
  };

  const handleOKClickOpen = () => {
    setShowEditorOpen(false); // Close the editor modal upon clicking OK
  };

  //title handle model

  const [showEditorOpen, setShowEditorOpen] = useState(false);

  const handleDescriptionClickTitle = () => {
    setShowEditorOpen(true); // Open the editor modal when description input field is clicked
  };

  const [tags, setTags] = useState([]);

  const [categories, setCategories] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const [inputValue1, setInputValue1] = useState("");

  const handleInputChange2 = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputChange3 = (event) => {
    setInputValue1(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue !== "") {
        setTags([...tags, trimmedValue]);
        setInputValue("");
      }
    }
  };

  const handleKeyDown1 = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedValue = inputValue1.trim();
      if (trimmedValue !== "") {
        setCategories([...categories, trimmedValue]);
        setInputValue1("");
      }
    }
  };

  // Function to handle tag deletion
  const handleTagDelete = (tagIndex) => {
    setTags(tags.filter((_, index) => index !== tagIndex));
  };

  const handleTagDelete1 = (tagIndex) => {
    setCategories(categories.filter((_, index) => index !== tagIndex));
  };

  // update blog
  const [posts, setPosts] = useState([]); // State to store fetched blog posts
  const [postIds, setPostIds] = useState();
  const [selectedPost, setSelectedPost] = useState(null); // State to store the selected post

  const [editedPost, setEditedPost] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
    postbrand: "",
    tags: [],
    category: [],
    statusUpdate: "edited",
  }); // State to store the edited post
  const [showEditor1, setShowEditor1] = useState(false);
  const [successMessage2, setSuccessMessage2] = useState("");
  const [showEditorOpen1, setShowEditorOpen1] = useState("");
  const [showEditor3, setShowEditor3] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const postsRef = firebase.database().ref("posts");
      postsRef.on("value", (snapshot) => {
        const posts = snapshot.val();
        const postsList = [];
        const firebasePostIds = [];

        for (let postId in posts) {
          postsList.push({ firebaseId: postId, ...posts[postId] });
          firebasePostIds.push(postId); // Store the Firebase ID
        }

        setPosts(postsList);
        setPostIds(firebasePostIds);
      });
    };

    fetchData();

    return () => {
      firebase.database().ref("posts").off();
    };
  }, []);

  const [successMessage4, setSuccessMessage4] = useState("");

  // selected posts
  const handlePostSelect = (postId) => {
    const selected = posts.find((post) => post.id == postId);
    setSelectedPost(selected);
    setEditedPost({ ...selected, statusUpdate: "edited" });
  };

  const handleUpdateContent = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Ensure postId is available for the selected post
    if (selectedPost) {
      const postId = selectedPost.id;
      const firebaseId = posts.find((post) => post.id == postId).firebaseId;

      console.log(`postId: ${postId}, firebaseId: ${firebaseId}`);

      // Update the post in the database
      firebase
        .database()
        .ref(`posts/${firebaseId}`)
        .update({ ...editedPost, date: formattedDate, tags: editedPost.tags })
        .then(() => {
          setSuccessMessage4("Post updated successfully.");
          toast.success("Post updated successfully.");
          console.log("Post updated successfully.");
          // Optionally, clear form fields or show a success message
        })
        .catch((error) => {
          console.error("Error updating post:", error);
          // Optionally, show an error message
        });
    } else {
      console.error("No post selected for update.");
      toast.error("No post selected for update.");
    }
  };

  // Handle input changes
  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setEditedPost({ ...editedPost, [name]: value });
  };
  const handleDescriptionEdit = () => {
    setShowEditor1(true);
  };

  const handleDescriptionEdit1 = () => {
    setShowEditor3(true);
  };

  const handleCloseEditorOpen = () => {
    setShowEditorOpen1(false);
  };

  // Handle editor changes
  const handleEditorChange1 = (value) => {
    setEditedPost({ ...editedPost, description: value });
  };

  const handleEditorChangeOpen1 = (value) => {
    setEditedPost({ ...editedPost, title: value });
  };

  const handleEditorChange3 = (value) => {
    setEditedPost({ ...editedPost, postbrand: value });
  };

  // Handle modal open/close
  const handleCloseEditor = () => {
    setShowEditor1(false);
  };

  const handleCloseEditorOpen1 = () => {
    setShowEditorOpen1(false);
  };
  const handleCloseEditor1 = () => {
    setShowEditor3(false);
  };
  const handleDescriptionEditOpen = () => {
    setShowEditorOpen1(true);
  };

  const [selectedPost2, setSelectedPost2] = useState(null);
  const [successMessage3, setSuccessMessage3] = useState("");

  const handlePostSelect1 = (postId) => {
    setSelectedPost2(posts.find((post) => post.id == postId));
  };

  const handleImageChange1 = (e) => {
    const file = e.target.files[0];
    const uploadTask = storage
      .ref(`images/${selectedPost.title}/${file.name}`)
      .put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function
      },
      (error) => {
        console.error(error);
      },
      () => {
        // Completion function
        storage
          .ref(`images/${selectedPost.title}`)
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            setEditedPost({ ...editedPost, image: url });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    );
  };

  const [tags1, setTags1] = useState([]);

  const handleTagChange = (e, index) => {
    const newTags = [...editedPost.tags];
    newTags[index] = e.target.value;
    setEditedPost({ ...editedPost, tags: newTags });
  };

  const handleTagDelete2 = (index) => {
    const newTags = [...editedPost.tags];
    newTags.splice(index, 1);
    setEditedPost({ ...editedPost, tags: newTags });
  };

  const handleInputChange4 = (event) => {
    setInputValue2(event.target.value);
  };

  const handleInputChange5 = (event) => {
    setInputValue3(event.target.value);
  };
  const [inputValue3, setInputValue3] = useState("");

  const handleKeyDown2 = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedValue = inputValue2.trim();
      if (trimmedValue !== "") {
        setEditedPost({
          ...editedPost,
          tags: [...editedPost.tags, trimmedValue],
        });
        setInputValue2("");
      }
    }
  };

  const handleKeyDown3 = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedValue = inputValue3.trim();
      if (trimmedValue !== "") {
        setEditedPost({
          ...editedPost,
          category: [...editedPost.category, trimmedValue],
        });
        setInputValue3("");
      }
    }
  };

  const [inputValue2, setInputValue2] = useState("");

  const handleCategoryChange = (e, index) => {
    const newCategories = [...editedPost.category];
    newCategories[index] = e.target.value;
    setEditedPost({ ...editedPost, category: newCategories });
  };

  const handleCategoryDelete = (index) => {
    const newCategories = [...editedPost.category];
    newCategories.splice(index, 1);
    setEditedPost({ ...editedPost, category: newCategories });
  };

  //delete blog
  const handleDeletePost = () => {
    if (selectedPost2) {
      const postId = selectedPost2.id;
      const firebaseId = posts.find((post) => post.id == postId).firebaseId;

      firebase
        .database()
        .ref(`posts/${firebaseId}`)
        .update({ statusUpdate: "Deleted" })
        .then(() => {
          setSuccessMessage3("Post deleted successfully.");
          toast.success("Post deleted successfully.");
          setPosts(posts.filter((post) => post.id !== postId));
          setSelectedPost2(null);
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
          toast.error("Error deleting post.");
        });
    } else {
      console.error("No post selected for deletion.");
      toast.error("No post selected for deletion.");
    }
  };

  //tab section
  const [activeSection, setActiveSection] = useState("addBlogPost");

  const handleTabClick = (section) => {
    setActiveSection(section);
  };

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

      <section className="section" id="blog-edit">
        <div className="container">
          <div className="d-flex justify-content-center my-4 main-content">
            <button
              className={`blog-buttons ${
                activeSection === "addBlogPost"
                  ? "add-blog-button-active"
                  : "add-blog-button"
              }`}
              onClick={() => handleTabClick("addBlogPost")}
            >
              Add Blog Post
            </button>
            <div className="mx-2"></div>
            <button
              className={`blog-buttons ${
                activeSection === "updateBlogPost"
                  ? "update-blog-button-active"
                  : "update-blog-button"
              }`}
              onClick={() => handleTabClick("updateBlogPost")}
            >
              Update Blog Post
            </button>
            <div className="mx-2"></div>
            <button
              className={`blog-buttons ${
                activeSection === "deleteBlogPost"
                  ? "delete-blog-button-active"
                  : "delete-blog-button"
              }`}
              onClick={() => handleTabClick("deleteBlogPost")}
            >
              Delete Blog Post
            </button>
          </div>
          {/*blog section*/}
          {activeSection === "addBlogPost" && (
            <>
              <Container className="d-flex justify-content-center">
                <div className="p-4 bg-white  blog-slide">
                  <h1
                    style={{
                      color: "rgb(23, 133, 130)",
                      textAlign: "center",
                      textTransform: "uppercase",
                      fontSize: "24px",
                    }}
                  >
                    Add Blog Post
                  </h1>
                  <div className="mx-5">
                    <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formTitle">
                        <Form.Label
                          style={{
                            fontWeight: "bold",
                            marginTop: "10px",
                            outline: "none",
                          }}
                        >
                          Title
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="text"
                          name="title"
                          value={newPost.title}
                          onClick={handleDescriptionClickTitle}
                          placeholder="Title"
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formDescription">
                        <Form.Label
                          style={{
                            fontWeight: "bold",
                            marginTop: "10px",
                            outline: "none",
                          }}
                        >
                          Description
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="text"
                          name="description"
                          value={newPost.description}
                          onClick={handleDescriptionClick} // Open editor modal when clicked
                          placeholder="Description"
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formImage">
                        <Form.Label
                          style={{
                            fontWeight: "bold",
                            marginTop: "10px",
                            outline: "none",
                          }}
                        >
                          Upload Image
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </Form.Group>
                      <Form.Group controlId="formAuthor">
                        <Form.Label
                          style={{
                            fontWeight: "bold",
                            marginTop: "10px",
                            outline: "none",
                          }}
                        >
                          Author
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="text"
                          name="author"
                          value={newPost.author}
                          onChange={handleInputChange}
                          placeholder="Author"
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formBrandName">
                        <Form.Label
                          style={{
                            fontWeight: "bold",
                            marginTop: "10px",
                            outline: "none",
                          }}
                        >
                          Brand Name
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="text"
                          name="brandName"
                          value={newPost.postbrand}
                          onClick={handleDescriptionClick1} // Open editor modal when clicked
                          placeholder="Brand Description"
                          required
                        />
                      </Form.Group>

                      <label
                        style={{
                          fontWeight: "bold",
                          marginTop: "10px",
                          marginBottom: "10px",
                          outline: "none",
                        }}
                      >
                        Tags
                      </label>
                      <br></br>
                      <Form.Group
                        className="tags-input"
                        style={{
                          width: "100%",
                          padding: "8px",
                          boxShadow: "none",
                        }}
                      >
                        <ul id="tags" />
                        {tags.map((tag, index) => (
                          <li key={index}>
                            {tag}{" "}
                            <button
                              className="delete-button"
                              onClick={() => handleTagDelete(index)}
                            >
                              X
                            </button>
                          </li>
                        ))}
                        <input
                          id="input-tag"
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange2}
                          onKeyDown={handleKeyDown}
                        />
                      </Form.Group>
                      <br></br>
                      <label
                        style={{
                          fontWeight: "bold",
                          marginTop: "10px",
                          marginBottom: "10px",
                          outline: "none",
                        }}
                      >
                        Category
                      </label>
                      <br></br>
                      <Form.Group
                        className="tags-input"
                        style={{
                          width: "100%",
                          padding: "8px",
                          boxShadow: "none",
                        }}
                      >
                        <ul id="categories" />
                        {categories.map((category, index) => (
                          <li key={index}>
                            {category}{" "}
                            <button
                              className="delete-button"
                              onClick={() => handleTagDelete1(index)}
                            >
                              X
                            </button>
                          </li>
                        ))}
                        <input
                          id="input-category"
                          type="text"
                          value={inputValue1}
                          onChange={handleInputChange3}
                          onKeyDown={handleKeyDown1}
                        />
                      </Form.Group>

                      <br></br>
                      <br></br>
                      <div className="text-center">
                        <Button
                          type="submit"
                          className="blog-buttons add-submit-button"
                        >
                          Add Post
                        </Button>
                      </div>
                    </Form>
                    <ToastContainer />
                  </div>
                  {/* {successMessage && (
                    <Alert variant="success" className="mt-3">
                      {successMessage}
                    </Alert>
                  )} */}
                </div>
                {/* Editor Modal */}
                <Modal show={showEditor} onHide={() => setShowEditor(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Description</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ReactQuill
                      value={newPost.description}
                      onChange={handleEditorChange}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "video",
                      ]}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowEditor(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleOKClick}>
                      OK
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* 2 Editor Modal */}
                <Modal show={showEditor2} onHide={() => setShowEditor2(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Brand Description</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ReactQuill
                      value={newPost.postbrand}
                      onChange={handleEditorChange2}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "video",
                      ]}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowEditor2(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleOKClick2}>
                      OK
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/*Title modal*/}
                <Modal
                  show={showEditorOpen}
                  onHide={() => setShowEditorOpen(false)}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Title</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ReactQuill
                      value={newPost.title}
                      onChange={handleEditorChangeOpen}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "video",
                      ]}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowEditorOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleOKClickOpen}>
                      OK
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Container>
              <br></br>
            </>
          )}

          {/*update blog*/}
          {activeSection === "updateBlogPost" && (
            <Container className="d-flex justify-content-center">
              <div className="p-4 bg-white  blog-slide">
                <h1
                  style={{
                    color: "rgb(23, 133, 130)",
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontSize: "24px",
                  }}
                >
                  Update Blog Post
                </h1>

                <Form>
                  <Form.Group controlId="formTitle">
                    <Form.Label
                      style={{
                        fontWeight: "bold",
                        outline: "none",
                        marginTop: "10px",
                      }}
                    >
                      Select Title
                    </Form.Label>
                    <Form.Control
                      style={{ borderRadius: "8px", marginBottom: "10px" }}
                      as="select"
                      onChange={(e) => handlePostSelect(e.target.value)}
                    >
                      <option value="">Select</option>
                      {posts.map((post) => (
                        <option key={post.id} value={post.id}>
                          {/* {post.title} */}
                          {`${parseHTML(post.title)}`}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  {selectedPost && (
                    <>
                      <Form.Group controlId="formTitle">
                        <Form.Label
                          style={{ fontWeight: "bold", outline: "none" }}
                        >
                          Title
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="text"
                          name="title"
                          value={editedPost.title}
                          onClick={handleDescriptionEditOpen}
                          placeholder="Title"
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formDescription">
                        <Form.Label
                          style={{ fontWeight: "bold", outline: "none" }}
                        >
                          Description
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="text"
                          name="description"
                          value={editedPost.description}
                          onClick={handleDescriptionEdit}
                          placeholder="Description"
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formImage">
                        <Form.Label
                          style={{ fontWeight: "bold", outline: "none" }}
                        >
                          Upload Image
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="file"
                          onChange={handleImageChange1}
                          accept="image/*"
                        />
                      </Form.Group>
                      {editedPost.image && (
                        <div>
                          <p>Current Image:</p>
                          <img
                            src={editedPost.image}
                            alt="Current"
                            style={{ maxWidth: "100px" }}
                          />
                        </div>
                      )}
                      <Form.Group controlId="formAuthor">
                        <Form.Label
                          style={{ fontWeight: "bold", outline: "none" }}
                        >
                          Author
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="text"
                          name="author"
                          value={editedPost.author}
                          onChange={handleInputChange1}
                          placeholder="Author"
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formBrandName">
                        <Form.Label
                          style={{ fontWeight: "bold", outline: "none" }}
                        >
                          Brand Description
                        </Form.Label>
                        <Form.Control
                          style={{ borderRadius: "8px" }}
                          type="text"
                          name="brandName"
                          value={editedPost.postbrand}
                          onClick={handleDescriptionEdit1}
                          placeholder="Brand Description"
                          required
                        />
                      </Form.Group>
                      <label
                        style={{
                          fontWeight: "bold",
                          marginTop: "10px",
                          marginBottom: "10px",
                          outline: "none",
                        }}
                      >
                        Tags
                      </label>
                      <br></br>
                      <Form.Group
                        className="tags-input"
                        style={{
                          width: "100%",
                          padding: "8px",
                          boxShadow: "none",
                        }}
                      >
                        <ul id="tags" />
                        {editedPost.tags &&
                          editedPost.tags.map((tag, index) => (
                            <li key={index}>
                              <input
                                type="text"
                                value={tag}
                                onChange={(e) => handleTagChange(e, index)}
                              />
                              <button
                                className="delete-button"
                                onClick={() => handleTagDelete2(index)}
                              >
                                X
                              </button>
                            </li>
                          ))}
                        <input
                          id="input-tag"
                          type="text"
                          value={inputValue2}
                          onChange={handleInputChange4}
                          onKeyDown={handleKeyDown2}
                          placeholder="Add a tag"
                        />
                      </Form.Group>
                      <br></br>

                      <label
                        style={{
                          fontWeight: "bold",
                          marginTop: "10px",
                          marginBottom: "10px",
                          outline: "none",
                        }}
                      >
                        Categories
                      </label>
                      <br />
                      <Form.Group
                        className="tags-input"
                        style={{
                          width: "100%",
                          padding: "8px",
                          boxShadow: "none",
                        }}
                      >
                        <ul id="categories">
                          {editedPost.category &&
                            editedPost.category.map((category, index) => (
                              <li key={index}>
                                <input
                                  type="text"
                                  value={category}
                                  onChange={(e) =>
                                    handleCategoryChange(e, index)
                                  }
                                />
                                <button
                                  className="delete-button"
                                  onClick={() => handleCategoryDelete(index)}
                                >
                                  X
                                </button>
                              </li>
                            ))}
                        </ul>
                        <input
                          id="input-category"
                          type="text"
                          value={inputValue3}
                          onChange={handleInputChange5}
                          onKeyDown={handleKeyDown3}
                          placeholder="Add a category"
                        />
                      </Form.Group>

                      <br></br>
                      <br></br>
                      <div className="text-center">
                        <Button
                          className="blog-buttons update-submit-button"
                          onClick={handleUpdateContent}
                        >
                          Update Post
                        </Button>
                      </div>
                    </>
                  )}
                </Form>
                <ToastContainer />
              </div>
              <Modal show={showEditor1} onHide={handleCloseEditor}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Description</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ReactQuill
                    value={editedPost.description}
                    onChange={handleEditorChange1}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "image",
                      "video",
                    ]}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditor}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleCloseEditor}>
                    Save
                  </Button>
                </Modal.Footer>
                {/* {successMessage4 && (
                  <Alert variant="success" className="mt-3">
                    {successMessage4}
                  </Alert>
                )} */}
              </Modal>

              <Modal show={showEditor3} onHide={handleCloseEditor1}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Brand Description</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ReactQuill
                    value={editedPost.postbrand}
                    onChange={handleEditorChange3}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "image",
                      "video",
                    ]}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditor1}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleCloseEditor1}>
                    Save
                  </Button>
                </Modal.Footer>
                {/* {successMessage4 && (
                  <Alert variant="success" className="mt-3">
                    {successMessage4}
                  </Alert>
                )} */}
              </Modal>
              {/*title description*/}
              <Modal show={showEditorOpen1} onHide={handleCloseEditorOpen}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Description</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ReactQuill
                    value={editedPost.title}
                    onChange={handleEditorChangeOpen1}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "image",
                      "video",
                    ]}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditorOpen1}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleCloseEditorOpen1}>
                    Save
                  </Button>
                </Modal.Footer>
                {/* {successMessage4 && (
                  <Alert variant="success" className="mt-3">
                    {successMessage4}
                  </Alert>
                )} */}
              </Modal>
            </Container>
          )}
          <br></br>
          {/*delete blog*/}
          {activeSection === "deleteBlogPost" && (
            <Container className="d-flex justify-content-center">
              <div className="p-4 bg-white blog-slide">
                <h3
                  style={{
                    color: "rgb(23, 133, 130)",
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontSize: "24px",
                  }}
                >
                  Delete Blog Post
                </h3>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label
                    style={{
                      fontWeight: "bold",
                      outline: "none",
                      marginTop: "10px",
                    }}
                  >
                    Select Post
                  </Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => handlePostSelect1(e.target.value)}
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="">Select</option>
                    {posts.map((post) => (
                      <option key={post.id} value={post.id}>
                        {/* {post.title} */}
                        {`${parseHTML(post.title)}`}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <ToastContainer />
                {selectedPost2 && (
                  <>
                    <p>Selected Title: {selectedPost2.title}</p>
                    <div className="text-center">
                      <Button
                        className="blog-buttons delete-submit-button"
                        onClick={handleDeletePost}
                      >
                        Delete Post
                      </Button>
                    </div>
                  </>
                )}
                {/* {successMessage3 && (
                  <Alert variant="success" className="mt-3">
                    {successMessage3}
                  </Alert>
                )} */}
              </div>
            </Container>
          )}
          <br></br>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default BlogEdit;
