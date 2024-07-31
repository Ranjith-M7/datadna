const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Firebase Admin SDK
const serviceAccount = require("./config/serviceAccountKey.json");

const testimonialdb = admin.initializeApp(
    {credential: admin.credential.cert(serviceAccount), databaseURL: "https://datadna-4eb54-default-rtdb.firebaseio.com",
    }, "testimonialdb");

// const port = 5000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/fetch-reviews", async (req, res) => {
  try {
    const {dateRange, star4, star5, minWords} = req.body;
    const currentTime = Math.floor(Date.now() / 1000);
    const pastTime = currentTime - dateRange * 30 * 24 * 60 * 60;

    const apiKey = "AIzaSyBebNtWsYWyOSZQcLqhTHjBpK7wQNbZ1FI";
    const placeId = "ChIJvU2hfgtRUjoRdXZ2tF2Ms0k";
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

    const response = await axios.get(url);
    let reviews = response.data.result.reviews;

    reviews = reviews.filter((review) => review.time >= pastTime);
    if (star4 && star5) {
      reviews = reviews.filter(
          (review) => review.rating === 4 || review.rating === 5);
    } else if (star4) {
      reviews = reviews.filter((review) => review.rating === 4);
    } else if (star5) {
      reviews = reviews.filter((review) => review.rating === 5);
    }

    reviews = reviews.filter(
        (review) => review.text.split(" ").length >= minWords);

    // Convert timestamp to DD/MM/YYYY IST format
    reviews = reviews.map((review) => {
      const date = new Date(review.time * 1000);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });
      return {
        ...review,
        formatted_date: formattedDate,
      };
    });

    const db = testimonialdb.database();
    const ref = db.ref("reviews");
    await ref.set(reviews);

    res.json({status: "success", reviews});
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({status: "error", message: error.message});
  }
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// Export the Express app as an HTTPS function
exports.api = functions.https.onRequest(app);
