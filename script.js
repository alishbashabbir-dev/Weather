const express = require("express");
const axios = require("axios");
const path = require("path");
const { MongoClient } = require("mongodb"); // Import MongoDB client
const app = express();
const apiKey = "a26cf2cf262cc5bd34f1bf6bea634354"; // OpenWeatherMap API Key
const mongoose = require("mongoose");

// Connect to MongoDB
let db;
mongoose.connect("mongodb://127.0.0.1:27017")
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Schema and model definition (for example)
const weatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    description: String,
    humidity: Number,
});

const Weather = mongoose.model("Weather", weatherSchema);

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html file for the root route
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "public", "index.html");
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Failed to load index.html:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});

// Serve the JavaScript file for the frontend
app.get("/public/index.js", (req, res) => {
    const filePath = path.join(__dirname, "public", "index.js");
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Failed to load index.js:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});

// Weather API route
app.get("/weather", async (req, res) => {
    try {
        // Extract city parameter
        const cityName = req.query.city;
        if (!cityName) {
            return res.status(400).json({ error: "City parameter is missing" });
        }

        // Construct API URL and fetch weather data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather`;
        const response = await axios.get(weatherUrl, {
            params: { q: cityName, appid: apiKey, units: "metric" },
        });

        // Prepare data to store in MongoDB
        const weatherData = {
            city: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            timestamp: new Date(),
        };

        // Insert the weather data into the MongoDB collection
        if (db) {
            const collection = db.collection("weatherData"); // Use "weatherData" collection
            await collection.insertOne(weatherData);
            console.log("Weather data inserted into MongoDB:", weatherData);
        } else {
            console.error("MongoDB is not connected");
        }

        // Send the response back to the client
        res.json(weatherData);
    } catch (error) {
        console.error("Failed to fetch weather data:", error.message);
        res.status(500).json({ error: "Failed to fetch data from API" });
    }
});

// Start the server
app.listen(8080, () => {
    console.log("Server listening at port 8080");
});
