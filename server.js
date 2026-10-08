import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
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

/* =========================
   AI TAILOR
========================= */

app.post("/api/garment-doctor", async (req, res) => {

  try {

    const {
      image,
      name,
      category
    } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "No garment image was provided."
      });
    }


    /* =========================
       READ IMAGE DATA
    ========================= */

    const match = image.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {
      return res.status(400).json({
        error: "The garment image format is not supported."
      });
    }

    const mimeType = match[1];
    const imageData = match[2];


    /* =========================
       AI INSTRUCTIONS
    ========================= */

    const prompt = `
You are the eCouture AI Tailor.

Analyse the clothing item shown in the image.

The user has labelled the item:

Name: ${name || "Unknown"}
Category: ${category || "Unknown"}

Use the IMAGE as your main source of information.

Identify:

1. The garment type.
2. The main visible colour.
3. Its apparent visible condition.
4. Any clearly visible wear, fading, stains, holes,
   tears or other visible issues.
5. Whether the garment appears suitable to keep and rewear.

IMPORTANT:

Only describe things that can reasonably be observed
from the photograph.

Do not claim that you can determine fabric strength,
internal damage, hygiene, safety or other properties
that cannot be confirmed visually.

If damage cannot clearly be seen, say:
"No obvious damage is visible in this image."

Return ONLY valid JSON using exactly this structure:

{
  "garment": "",
  "colour": "",
  "condition": "",
  "observation": "",
  "verdict": ""
}

For verdict, use one of these short sustainability-focused phrases:

"KEEP & REWEAR"
"REPAIR & REWEAR"
"UPCYCLE & REWEAR"

Do not include Markdown.
Do not include any text outside the JSON.
`;


    /* =========================
       SEND IMAGE TO GEMINI
    ========================= */

    const response = await ai.models.generateContent({

      model: "gemini-3.5-flash-lite",

      contents: [
        {
          role: "user",

          parts: [

            {
              text: prompt
            },

            {
              inlineData: {
                mimeType: mimeType,
                data: imageData
              }
            }

          ]
        }
      ]

    });


    /* =========================
       CLEAN AI RESPONSE
    ========================= */

    let text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(text);

    res.json(analysis);


  } catch (error) {

    console.error(
      "========== AI TAILOR ERROR =========="
    );

    console.error(error);

    console.error(
      "=========================================="
    );

    res.status(500).json({
      error:
        "The AI Tailor could not analyse this garment."
    });

  }

});

/* =========================
   AI TAILOR ACTIONS
========================= */

app.post("/api/ai-tailor", async (req, res) => {

  try {

    const {
      action,
      image,
      name,
      category,
      condition,
      mainStyle,
      secondStyle
    } = req.body;


    if (!image || !action) {

      return res.status(400).json({
        error: "Garment information is missing."
      });

    }


    /* =========================
       READ IMAGE
    ========================= */

    const match = image.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {

      return res.status(400).json({
        error: "The garment image format is not supported."
      });

    }


    const mimeType = match[1];
    const imageData = match[2];


    /* =========================
       ACTION INSTRUCTIONS
    ========================= */

    let task = "";


    if (action === "repair") {

      task = `
Examine the visible garment and suggest a realistic
way the user could repair or refresh it.

If there is visible damage, explain how that specific
issue could be repaired.

If no obvious damage is visible, do NOT invent damage.
Instead explain that repair may not currently be
necessary and suggest one simple maintenance or
refresh idea.

Give 3 short practical steps.
`;

    }


    else if (action === "restyle") {

      task = `
Create a new outfit using this garment.

The user's main personal style is:
${mainStyle || "Not available"}

Their secondary style is:
${secondStyle || "Not available"}

Make the outfit reflect their personal style.

Suggest:
- what to pair with this garment
- suitable shoes
- one accessory or finishing detail

Do not recommend purchasing specific brands.
Keep the suggestion practical and concise.
`;

    }


    else if (action === "upcycle") {

      task = `
Create ONE creative but realistic upcycling idea
for this exact garment.

The user's main personal style is:
${mainStyle || "Not available"}

Their secondary style is:
${secondStyle || "Not available"}

The transformation should suit their style while
keeping as much of the original garment as possible.

Explain:
1. The transformation idea.
2. What should physically be changed.
3. What the finished garment would look like.

Do not suggest throwing the garment away.
`;

    }


    else {

      return res.status(400).json({
        error: "Unknown AI Tailor action."
      });

    }


    /* =========================
       FULL PROMPT
    ========================= */

    const prompt = `
You are the eCouture AI Tailor.

You help people extend the life of clothes they
already own rather than encouraging unnecessary
fashion purchases.

GARMENT INFORMATION

Name: ${name || "Unknown"}
Category: ${category || "Unknown"}
User-listed condition: ${condition || "Unknown"}

Use the supplied garment IMAGE as your main visual
reference.

${task}

IMPORTANT:

Only make visual claims that can reasonably be
supported by the photograph.

Do not invent stains, holes, tears or other damage
that cannot clearly be seen.

Keep the response short, engaging and suitable for
display inside a fashion website.

Use plain text only.
Do not use Markdown.
Do not use hashtags.
Do not use asterisks.
`;


    /* =========================
       ASK GEMINI
    ========================= */

    const response = await ai.models.generateContent({

      model: "gemini-3.5-flash-lite",

      contents: [
        {
          role: "user",

          parts: [

            {
              text: prompt
            },

            {
              inlineData: {
                mimeType: mimeType,
                data: imageData
              }
            }

          ]

        }
      ]

    });


    let cleanResponse = response.text
      .replace(/#{1,6}\s*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\\/g, "")
      .trim();


    res.json({
      recommendation: cleanResponse
    });


  } catch (error) {

    console.error(
      "========== AI TAILOR ERROR =========="
    );

    console.error(error);

    console.error(
      "====================================="
    );


    res.status(500).json({
      error:
        "The AI Tailor could not create a suggestion."
    });

  }

});

/* =========================================
   ECOSTREAK — AI OUTFIT MATCHING
========================================= */

app.post("/api/ecostreak-analyse", async (req, res) => {
  try {
    const { image, wardrobe } = req.body;

    if (!image || !Array.isArray(wardrobe)) {
      return res.status(400).json({
        error: "Outfit photo or wardrobe is missing."
      });
    }

    const match = image.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {
      return res.status(400).json({
        error: "Unsupported outfit image."
      });
    }

    const wardrobeList = wardrobe.map(item => ({
      id: String(item.id),
      name: String(item.name),
      category: String(item.category)
    }));

    const prompt = `
You are the E-Couture EcoStreak AI Vision Assistant.

Examine the uploaded outfit photograph and identify
the clothing items that are clearly visible.

The user's Digital Closet inventory is:
${JSON.stringify(wardrobeList)}

Suggest possible matches ONLY from that inventory.

The inventory contains item names and categories, not
reference photographs. Therefore, matches are tentative,
not visually verified garment identities.

Do not invent clothing items or IDs.
Do not claim that a match is certain.
If there is insufficient evidence, return no matches.

Return ONLY valid JSON:
{
  "description": "Short description of visible outfit",
  "matches": [
    {
      "id": "exact inventory ID",
      "reason": "Why this may be a match"
    }
  ],
  "tip": "One short idea for rewearing this outfit"
}

Use a maximum of 5 matches.
No markdown or extra explanation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [{
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          }
        ]
      }]
    });

    const raw = response.text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(raw);
    const allowed = new Set(wardrobeList.map(i => i.id));

    const matches = Array.isArray(result.matches)
      ? result.matches.filter(
          item => allowed.has(String(item.id))
        ).map(item => ({
          id: String(item.id),
          reason: String(item.reason || "Possible match")
        }))
      : [];

    res.json({
      description: String(result.description || ""),
      matches,
      tip: String(result.tip || "")
    });

  } catch (error) {
    console.error("ECOSTREAK AI ERROR:", error);

    res.status(500).json({
      error: "EcoStreak AI could not analyse the outfit."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`eCouture is running on port ${PORT}`);
});
