const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // ✅ Explicitly require node-fetch for compatibility

const app = express();
app.use(cors()); // Enable CORS

const PORT = process.env.PORT || 3000;
const API_URL = "https://bycliff.od2.vtiger.com/restapi/vtap/api/NewestCaseTest";
const username = process.env.VTIGER_USERNAME;
const accessKey = process.env.VTIGER_ACCESS_KEY;

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("✅ Vtiger Proxy is running! Use /latest-case to fetch data.");
});

// ✅ API Proxy Route
app.get("/latest-case", async (req, res) => {
    try {
        if (!username || !accessKey) {
            throw new Error("❌ Missing VTIGER_USERNAME or VTIGER_ACCESS_KEY in Render environment variables.");
        }

        const response = await fetch(API_URL, {
            headers: {
                "Authorization": "Basic " + Buffer.from(username + ":" + accessKey).toString("base64"),
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Vtiger API Error ${response.status}: ${errorText}`);
            throw new Error(`Vtiger API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching Vtiger case:", error.message);
        res.status(500).json({ error: "Failed to fetch case data", details: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
