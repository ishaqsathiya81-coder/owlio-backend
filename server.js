import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Test route
app.get("/test", (req, res) => {
  res.send("Owlio backend is working!");
});

// ✅ AI route
app.post("/ask", async (req, res) => {
  console.log("🟢 /ask endpoint hit");

  try {
    const { question } = req.body;
    console.log("Received question:", question);

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ Missing OpenAI API Key");
      return res.status(500).json({ error: "Missing OpenAI API Key" });
    }

    // Call OpenAI API
    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: question }],
    });

    console.log("AI response received.");

    res.json({
      answer: completion.choices[0].message.content,
    });
  } catch (err) {
    console.log("❌ Error in /ask:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open forwarded URL in GitHub Codespaces to test.`);
});
