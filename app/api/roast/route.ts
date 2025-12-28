import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// REMOVED: const groq = new Groq(...) from here to prevent build errors

const SYSTEM_PROMPT = `
You are a professional roast master and meme generator.
Your goal is to look at the user's uploaded screen (calendar, desktop, code, etc.) and ruthlessly judge them.

RETURN JSON ONLY. The JSON must match this structure:
{
  "roast": "A 1-2 sentence savage insult about their life based on the image.",
  "meme_caption": "A short, punchy caption for a meme.",
  "visual_description": "A description of what the meme image should look like (e.g. 'A tired racoon eating trash').",
  "burnout_score": A number between 0 and 100.
  "fixed_schedule": [
    { "time": "9:00 AM", "activity": "Funny alternative activity" },
    { "time": "11:00 AM", "activity": "Funny alternative activity" },
    { "time": "2:00 PM", "activity": "Funny alternative activity" }
  ]
}

BEHAVIOR:
- If it's a calendar: Mock their lack of free time or their useless meetings.
- If it's messy: Mock their disorganization.
- Be funny, sarcastic, and use internet slang (Gen Z / Brainrot humor allowed).
- fixed_schedule: Create 3 satirical calendar entries that "fix" their stress (e.g., "Touch grass", "Scream", "Nap", "Plot revenge").
`;

export async function POST(req: Request) {
  try {
    // --- 🛠️ THE FIX IS HERE ---
    // We initialize the client INSIDE the function. 
    // The "|| 'dummy'" part prevents Vercel from crashing during the build process if the key isn't found.
    const groq = new Groq({ 
      apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build" 
    });

    // Validating the key exists before making the actual call
    if (!process.env.GROQ_API_KEY) {
      console.error("Missing API Key on server");
      return NextResponse.json({ error: "Server API Key missing" }, { status: 500 });
    }
    // ---------------------------

    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Send to Groq (Llama 4 Scout)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: SYSTEM_PROMPT },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const jsonResponse = JSON.parse(content || "{}");

    return NextResponse.json(jsonResponse);

  } catch (error: any) {
    console.error("Roast Error:", error);
    return NextResponse.json({ error: "Failed to roast" }, { status: 500 });
  }
}