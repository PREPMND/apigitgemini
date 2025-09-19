const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'PREwb')));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'PREwb', 'i.html'));
});

app.post("/gemini", async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: "Gemini API key not set in .env" });
    }
    const { prompt } = req.body;
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        res.json({ text });
    } catch (err) {
        res.status(500).json({ error: "Error from Gemini API" });
    }
});
app.post("/speak", async (req, res) => {
    const { text } = req.body;
    const client = new textToSpeech.TextToSpeechClient();
    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        const filePath = path.join(__dirname, 'public', 'output.mp3');
        await fs.promises.writeFile(filePath, Buffer.from(response.audioContent, 'binary')).
        res.json({ audioUrl: "output.mp3" });
    } catch (error) {
        res.status(500).json({ error: "Text-to-Speech failed" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

