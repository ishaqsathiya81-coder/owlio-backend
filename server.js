// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Home route
app.get("/", (req, res) => {
  res.send("Owlio backend is working!");
});

// AI route
app.post("/ask", async (req, res) => {
  console.log("🟢 /ask endpoint hit");

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    if (!process.env.OPENAI_API_KEY) throw new Error("Missing OpenAI API Key");

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: question }],
    });

    const answer = completion.choices[0]?.message?.content || "No response from AI";
    console.log("AI response received:", answer);

    res.json({ answer });
  } catch (err) {
    console.log("❌ Error in /ask:", err.message);
    res.json({ answer: `Debug response: ${question}` });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
