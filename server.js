import express from "express";
import bodyParser from "body-parser";
import { Client } from "twilio";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Health check
app.get("/", (req, res) => {
  res.send("OK");
});

const twilio = new Client(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/whatsapp", async (req, res) => {
  console.log("Mensaje recibido:", req.body.Body);

  try {
    const msg = req.body.Body;
    const from = req.body.From;

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente de una clínica." },
        { role: "user", content: msg }
      ]
    });

    await twilio.messages.create({
      from: "whatsapp:" + process.env.TWILIO_WHATSAPP_NUMBER,
      to: from,
      body: ai.choices[0].message.content
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("ERROR:", err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});