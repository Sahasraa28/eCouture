import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("."));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/style-me", async (req, res) => {

  try {

    const {
      mainStyle,
      secondStyle,
      mainPercent,
      secondPercent,
      occasion,
      wardrobe
    } = req.body;

    const wardrobeText = wardrobe
      .map(item =>
        `${item.name} (${item.category}) - ${item.condition}`
      )
      .join("\n");

    const prompt = `
You are the eCouture AI Personal Stylist.

The user's personal fashion style has been determined by the eCouture Style Quiz.

Their style profile is:
Primary style: ${mainStyle} (${mainPercent}%)
Secondary style: ${secondStyle} (${secondPercent}%)

The user's Style Quiz profile MUST be the main influence when creating the outfit.

Prioritise clothing and styling choices that match the primary style.
Use the secondary style as an additional influence where appropriate.

The user is dressing for:
${occasion}

Their Digital Wardrobe contains:
${wardrobeText}

Create ONE personalised outfit using ONLY items that exist in the user's wardrobe.

The outfit should match:
1. The user's Style Quiz profile.
2. The selected occasion.
3. The condition of the clothes available in their Digital Wardrobe.
Do not recommend buying new clothing.

Consider the condition of each clothing item and avoid items that need repair if suitable alternatives exist.

Explain briefly why the outfit matches the user's style profile and occasion.

Give one styling tip.

Finish with a short sustainability message encouraging the user to reuse clothes they already own.

Keep the response short, friendly and suitable for a fashion website.

Do not use Markdown formatting.
Do not use hashtags, asterisks, bullet symbols or backslashes.
Do not introduce yourself.
Do not say "As your eCouture AI Personal Stylist".

Use this simple structure:

OUTFIT
State the selected clothing items.

WHY IT WORKS
Briefly explain how the outfit matches the user's Style Quiz profile and occasion.

STYLING TIP
Give one short styling suggestion using only items available in the wardrobe.

SUSTAINABILITY
Give one short sentence about reusing clothes they already own.

Keep the entire response concise and clean.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    let cleanResponse = response.text
  .replace(/#{1,6}\s*/g, "")   // removes #, ##, ###
  .replace(/\*\*/g, "")        // removes **
  .replace(/\*/g, "")          // removes *
  .replace(/\\/g, "")          // removes \
  .trim();

res.json({
  recommendation: cleanResponse
});

  } catch (error) {

    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error("==================================");

    res.status(500).json({
      error: error.message || "The AI stylist could not create an outfit."
    });

  }

});

/* =========================
   AI STYLE QUIZ ANALYSER
========================= */

app.post("/api/analyse-style", async (req, res) => {

  try {

    const {
      age,
      collection,
      answers,
      description
    } = req.body;

    const answersText = answers
      .map((answer, index) =>
        `Answer ${index + 1}: ${answer}`
      )
      .join("\n");

    const prompt = `
You are the eCouture AI Style Analyst.

Analyse the user's complete fashion quiz and determine their personal
fashion style profile.

The ONLY style categories you may use are:

Y2K
Streetwear
Casual
Chic
Elegant
Sporty
Minimalist
Preppy

USER INFORMATION:

Age group:
${age}

Preferred collection:
${collection}

QUIZ ANSWERS:

${answersText}

USER'S OWN STYLE DESCRIPTION:

${description || "No description provided."}

Analyse the user's preferences as a whole.

Do NOT simply count how many answers belong to each style.

Consider the meaning of their outfit choices, preferred fit,
accessories, jacket, colour palette, priorities and their own
description.

Return percentages for ALL eight styles.

The percentages MUST total exactly 100.

Return ONLY valid JSON in exactly this format:

{
  "y2k": 0,
  "streetwear": 0,
  "casual": 0,
  "chic": 0,
  "elegant": 0,
  "sporty": 0,
  "minimalist": 0,
  "preppy": 0
}

Do not include markdown.
Do not include an explanation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    let text = response.text.trim();

    // Remove markdown code fences if Gemini adds them
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const styleProfile = JSON.parse(text);

    res.json(styleProfile);

  } catch (error) {

    console.error("========== STYLE ANALYSIS ERROR ==========");
    console.error(error);
    console.error("==========================================");

    res.status(500).json({
      error: "The AI could not analyse your style."
    });

  }

});

const PORT = process.env.PORT || 3000;

/* =========================
   AI IMPACT ANALYSIS
========================= */

app.post("/api/impact-analysis", async (req, res) => {

  try {

    const {
      period,
      amount
    } = req.body;

    const prompt = `
You are the eCouture AI Sustainability Analyst.

The eCouture Impact Monitor is showing an estimated
${amount} tonnes of global textile waste for ${period}.

Explain what this amount means in a simple and engaging way
for someone visiting a sustainable fashion website.

Connect the explanation to eCouture's goal of encouraging
people to reuse, restyle and repair clothes they already own
instead of constantly buying new clothing.

IMPORTANT:
Do not invent any new statistics.
Do not change the waste figure provided.
Do not recommend buying products.
Keep the response to 2 or 3 short sentences.
Use plain text only.
Do not use Markdown, hashtags, bullet points or asterisks.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    let cleanResponse = response.text
      .replace(/#{1,6}\s*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\\/g, "")
      .trim();

    res.json({
      analysis: cleanResponse
    });

  } catch (error) {

    console.error("========== IMPACT ANALYSIS ERROR ==========");
    console.error(error);
    console.error("==========================================");

    res.status(500).json({
      error: "The AI could not analyse the environmental impact."
    });

  }

});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`eCouture is running on port ${PORT}`);
});