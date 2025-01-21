const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // ✅ Ensure correct import for Node.js 16+

const app = express();

// ✅ Configure CORS to Allow Your GitHub Pages Site
const corsOptions = {
    origin: "https://lilstrbuk.github.io/vtigertest/", // 🔄 Replace with your GitHub Pages URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Enable CORS

const PORT = process.env.PORT || 3000;
const API_URL = "https://bycliff.od2.vtiger.com/restapi/vtap/api/NewestCaseTest";
const username = process.env.VTIGER_USERNAME;
const accessKey = process.env.VTIGER_ACCESS_KEY;

// ✅ Default Route (Confirms Server is Running)
app.get("/", (req, res) => {
    res.send("✅ Vtiger Proxy is running! Use /latest-case to fetch data.");
});

// ✅ API Proxy Route
app.get("/latest-case", async (req, res) => {
    try {
        if (!username || !accessKey) {
            throw new Error("❌ Missing VTIGER_USERNAME or VTIGER_ACCESS_KEY in environment variables.");
        }

        console.log("🔹 Fetching case data from Vtiger...");

        const response = await fetch(API_URL, {
            headers: {
                "Authorization": "Basic " + Buffer.from(username + ":" + accessKey).toString("base64"),
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Vtiger API Error ${response.status}: ${errorText}`);
            throw new Error(`Vtiger API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Successfully retrieved case data:", data);
        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching Vtiger case:", error.message);
        res.status(500).json({ error: "Failed to fetch case data", details: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
