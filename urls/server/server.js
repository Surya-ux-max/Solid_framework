const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary database (Memory)
const urlMap = {};

// Generate 6-character code
function generateShortCode() {
    return crypto.randomBytes(3).toString("hex");
}

// Home Route
app.get("/", (req, res) => {
    res.send("🚀 URL Shortener API Running");
});

// Shorten URL
app.post("/shorten", (req, res) => {

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            message: "Please enter a URL."
        });
    }

    const shortCode = generateShortCode();

    urlMap[shortCode] = url;

    res.json({
        originalUrl: url,
        shortCode: shortCode,
        shortUrl: `http://localhost:${PORT}/${shortCode}`
    });

});

// Redirect
app.get("/:code", (req, res) => {

    const code = req.params.code;

    if (!urlMap[code]) {
        return res.status(404).send("URL Not Found");
    }

    res.redirect(urlMap[code]);

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});