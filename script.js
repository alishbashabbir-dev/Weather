const express = require("express");
const axios = require("axios");
const path = require("path");
const { MongoClient } = require("mongodb"); // Import MongoDB client
const app = express();
const apiKey = "a26cf2cf262cc5bd34f1bf6bea634354"; // OpenWeatherMap API Key

// MongoDB Connection URI and Database Name
const mongoUri = "mongodb+srv://bsef21m504:voG8WDhtso0Lj2vq@cluster0.pp75j.mongodb.net/";
const dbName = "weatherData"; // Name of your database

// Connect to MongoDB
let db;
MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
    });

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
        const weatherUrl =" https://api.openweathermap.org/data/2.5/weather";
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

// Add to Favorites route
app.get("/addToFavorite", async (req, res) => {
    try {
        // Extract city parameter
        const cityName = req.query.city;
        if (!cityName) {
            return res.status(400).json({ error: "City parameter is missing" });
        }

        // Construct API URL and fetch weather data
        const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
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

        // Insert the weather data into the "Favorites" collection in MongoDB
       if (db) {
    const collection = db.collection("Favorites"); // Access the "Favorites" collection
    await collection.insertOne(weatherData); // Insert data into the collection
    console.log("Fav Weather data inserted into MongoDB:", weatherData);
} 

        else {
            console.error("MongoDB is not connected");
        }

        // Send the response back to the client
        res.json(weatherData);
    } catch (error) {
        console.error("Failed to fetch weather data:", error.message);
        res.status(500).json({ error: "Failed to fetch data from API" });
    }
});

app.get("/favorites", async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: "Database connection error" });
        }
        const collection = db.collection("Favorites");
        const favCities = await collection.find().toArray();
        if (favCities.length === 0) {
            return res.status(404).json({ error: "No favorite cities found" });
        }
        res.json(favCities); // Return favorite cities as JSON
    } catch (err) {
        console.error("Error fetching favorites:", err);
        res.status(500).json({ error: "Failed to fetch cities from database" });
    }
});


// Start the server
app.listen(8080, () => {
    console.log("Server listening at port 8080");
});