import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Create HTTP server to attach both express and websockets
  const httpServer = createHttpServer(app);

  // Initialize WebSockets on httpServer
  const wss = new WebSocketServer({ noServer: true });

  // Attach upgrade handler to support /api/live-ws
  httpServer.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);
    if (url.pathname === "/api/live-ws") {
      wss.handleUpgrade(request, socket, head, (wsInstance) => {
        wss.emit("connection", wsInstance, request);
      });
    } else {
      socket.destroy();
    }
  });

  // REST API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/research", async (req: any, res: any) => {
    const { query, country } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not defined on the server." });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      console.log(`[Research API] Running Search Grounded research for: "${query}" in country: ${country || 'Any'}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert regional researcher, geographic analyst, and local advisory specialist for West Africa, operating on the level of DeepSeek-R1's deep multi-step thinking capability.
Perform a comprehensive and highly accurate research study and present verified facts on: "${query}".
${country ? `Focus specifically on the country/region of ${country} in West Africa.` : "The focus is any relevant place, city, landmark, culture, or historical event in West Africa."}

Instructions:
1. First, perform a profound logical reasoning process inside a <thought>...</thought> block. 
   In the <thought> block (which MUST be at the very top of your response):
   - Outline your step-by-step search strategy, questions to verify, and critical evaluation of information validity.
   - Analyze potential historical discrepancies or changing current events (like currency rates, safety indices, travel hubs, political milestones).
   - Formulate exactly what sources you are evaluating and your step-by-step resolution.
   - Write at least 2-3 detailed paragraphs of intense, high-fidelity analytical reasoning inside the <thought> block.
2. Provide latest, highly accurate, real-world verified facts.
3. Structure the main report below the <thought> block dynamically with these standard clear headings:
   - **Overview & Geographical Context**: A strong descriptive intro including coordinate locations or regions if applicable.
   - **Historical & Cultural Significance**: Background, monuments, importance of people, dynasties, or colonial background.
   - **Logistical & Practical Intelligence**: Current currency rates, primary languages spoken, travel advisories, safety indices, and connectivity levels (airport hubs/road networks).
   - **Local Hidden Gems & Modern Highlights**: Culturally rich local recommendations, latest economic events, and landmarks.
4. Be professional, highly educational, engaging, objective, and clear. Ensure no details are missing—provide 100% complete intelligence details.
5. Integrate Google Search grounding details to back up your facts.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = response.text || "No research findings generated.";
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;

      let thinking = "";
      let text = rawText;

      const thoughtStart = rawText.toLowerCase().indexOf("<thought>");
      const thoughtEnd = rawText.toLowerCase().indexOf("</thought>");
      if (thoughtStart !== -1 && thoughtEnd !== -1) {
        thinking = rawText.substring(thoughtStart + 9, thoughtEnd).trim();
        text = rawText.substring(thoughtEnd + 10).trim();
      } else if (thoughtStart !== -1) {
        thinking = rawText.substring(thoughtStart + 9).trim();
        text = "";
      }

      res.json({
        text,
        thinking,
        groundingMetadata,
      });
    } catch (err: any) {
      console.error("[Research API] Error:", err);
      res.status(500).json({ error: err.message || "Failed to execute search grounding." });
    }
  });

  // WebSocket Server Setup
  wss.on("connection", async (clientWs: WebSocket, req: any) => {
    console.log("[WS] Client connected to live-audio bridge");

    const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
    const selectedVoice = url.searchParams.get("voice") || "Zephyr";
    const selectedLang = url.searchParams.get("lang") || "en";
    console.log(`[WS] Selected voice: ${selectedVoice}, language: ${selectedLang}`);

    // Map language parameter to specific instructions
    let languageGuide = "";
    if (selectedLang === "fr") {
      languageGuide = "Start in French: 'S'il vous plaît, communiquez en français.' Maintain a polite, professional corporate tone.";
    } else if (selectedLang === "es") {
      languageGuide = "Start in Spanish: 'Por favor, comunícate en español.' Maintain a warm, welcoming client service tone.";
    } else if (selectedLang === "ar") {
      languageGuide = "Start in Arabic: 'يرجى التحدث باللغة العربية.' Keep a respectful, helpful, customer support tone.";
    } else if (selectedLang === "pcm") {
      languageGuide = "Start in Nigerian Pidgin: 'Abeg speak Nigerian Pidgin language.' Make your voice friendly, warm, and conversational.";
    } else if (selectedLang === "kri") {
      languageGuide = `Start in Sierra Leone Krio: 'YOU MUST COMMUNICATE PRINCIPALLY AND FLUENTLY IN SIERRA LEONE KRIO.' Keep the voice sweet, respectful, warm, and natural.
Here is the exact way to speak Krio based on native guidelines and conversational models:
- "Aw di bodi?" -> Respond with "Di bodi fine, tenki. Aw yu sef?"
- "Wetin na yu nem?" -> Respond with "Mi nem na Hakim Isaac."
- "Usay yu de?" -> Respond with "A de ya for help yu."
- "Ow di tem?" -> Respond with "Di tem fine tiday."
- "Yu fit help mi?" -> Respond with "Yes, a fit try for help yu. Wetin yu want mek a do?"
- "Gud mɔnin." or "Gud monin." -> Respond with "Gud mɔnin. Aw yu slip?"
- "Gud ivnin." -> Respond with "Gud ivnin. Aw di day bin go?"
- "Tenki." -> Respond with "Yu welcam."
- "A want lan Krio." -> Respond with "Dat na gud idea. A go help yu lan Krio."
- "Wetin dis min?" -> Respond with "Explain am to mi, mek a tell yu di minin."
- "A de hongri." -> Respond with "Yu for try chop somtin if yu get chance."
- "A de go makit." -> Respond with "Oke, mek yu get safe journey."
- "Aw much dis cost?" -> Respond with "A nor sabi di price, but yu fit ask di seller."
- "Wetin yu fit do?" -> Respond with "A fit answer question dem, help wit writing, and give information."
- "Bye." -> Respond with "Oke, tek kia. A go de ya if yu need help."

Use vocabulary words and structure like "wi day-to-day life na Siera Lion", "pipul dem de use teknoloji for communicate, learn, do business, and solve plenty problem dem.", "tiday, wit smartphone and internet, person fit talk to en family or business partner", "dis don help for make...", "some challenge dem still de", "unstable electricity supply", "Oke, tek kia."`;
    } else if (selectedLang === "men") {
      languageGuide = "Start in Sierra Leone Mende: greet warmly with 'Bua' (Hello) or 'Bi bɛi bɛi?' (How are you?). Speak Mende naturally, translate back and forth, and coordinate the schedule.";
    } else if (selectedLang === "tem") {
      languageGuide = "Start in Sierra Leone Temne: greet warmly with 'Sekɛ' (Hello) or 'Kɔ raye?' (How are you?). Speak Temne naturally, translate back and forth, and coordinate the schedule.";
    } else if (selectedLang === "lym") {
      languageGuide = "Start in Sierra Leone Limba: greet warmly with 'Malaŋ' (Hello) or 'Aw bɛh?' (How are you?). Speak Limba naturally, translate back and forth, and coordinate the schedule.";
    } else if (selectedLang === "kno") {
      languageGuide = "Start in Sierra Leone Kono: greet warmly with 'Ah bɛɛ bɛi?' (Hello/How are you?). Speak Kono naturally, translate back and forth, and coordinate the schedule.";
    } else {
      languageGuide = "Start in English: Keep a friendly, clear, welcoming, and highly professional tone.";
    }

    const systemInstruction = `You are Hakim Isaac, an exceptional artificial intelligence business phone receptionist and voice customer service assistant with a warm, distinctive West African accent. You are representing the user's business with utmost distinction.

ACCENT AND PHRASING (CRITICAL):
- You MUST speak with a clear, professional, warm, and highly melodic West African (specifically Sierra Leonean/Nigerian) accent and cadence.
- Use West African speech rhythms, warm regional inflections, and respectful cultural phrasing (e.g. greeting warmly, showing respect) in your spoken audio, whether speaking English, Pidgin, or Krio.
- Make the voice sounds extremely reassuring, friendly, polite, and authentic.

Your key duties:
1. Greet callers warmly and answer customer inquiries.
2. Direct customer bookings, schedule appointments/meetings, and coordinate calendar slots.
3. Schedule dynamic follow-ups at logical future dates requested by customers.
4. Keep your answers brief, helpful, and extremely natural (1 to 2 short sentences at most) suitable for spoken audio conversation.

DYNAMIC LANGUAGE ADAPTATION & TRANSLATION (CRITICAL):
Do NOT primarily force English if the caller starts speaking or typing in another language. You are fully responsive and multilingual:
- Always detect the caller's language or dialect dynamically (English, Sierra Leone Krio, Mende, Temne, Limba, Kono, Nigerian Pidgin, Spanish, French, or Arabic).
- Instantly switch to match the exact language and dialect of the caller's last turn, translate ethnic groups like Mende, Temne, Limba, and Kono to English, and keep the dynamic booking slots updated!
- If they speak Krio, respond using perfect, natural Sierra Leone Krio (using rhythmic phrases and vocabulary like 'Aw di bodi?', 'Tenki', etc.).
- If they speak Pidgin, respond in Pidgin.
- If they speak Spanish, respond in Spanish.
- If they speak French, respond in French.
- If they speak Arabic, respond in Arabic.
- If they speak English, respond in English.
- Be extremely responsive and let the language used by the caller guide your response language.

Initial Dialect Target: ${languageGuide} 

Act as a human agent would, with warmth, quick response, and clear intent.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[WS] GEMINI_API_KEY is not defined in the backend environment");
      clientWs.send(JSON.stringify({ 
        type: "error", 
        error: "GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets in the AI Studio UI." 
      }));
      clientWs.close();
      return;
    }

    let session: any = null;

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      console.log("[WS] Connecting to Gemini Live API...");

      session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } }, // Zephyr, Kore, Puck, Charon, Fenrir
          },
          // Enable input & output transcripts
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onmessage: (message: any) => {
            // Check for server-side packet values
            const packet: any = { type: "server-message" };

            // Find parts in model turn (sound clips)
            const audioPart = message.serverContent?.modelTurn?.parts?.find((p: any) => p.inlineData?.data);
            if (audioPart?.inlineData?.data) {
              packet.audio = audioPart.inlineData.data;
            }

            // Output transcription (what the model has spoken so far)
            const textPart = message.serverContent?.modelTurn?.parts?.find((p: any) => p.text);
            if (textPart?.text) {
              packet.text = textPart.text;
            }

            // User input transcription (what the user spoke)
            const userTurnParts = message.serverContent?.userTurn?.parts;
            const userText = userTurnParts?.find((p: any) => p.text)?.text;
            if (userText) {
              packet.userTranscript = userText;
            }

            // Check if user or session is interrupted
            if (message.serverContent?.interrupted) {
              packet.interrupted = true;
            }

            if (message.serverContent?.turnComplete) {
              packet.turnComplete = true;
            }

            // Send standard status packets
            clientWs.send(JSON.stringify(packet));
          },
          onclose: () => {
            console.log("[WS] Gemini session closed");
            clientWs.send(JSON.stringify({ type: "status", status: "session-closed" }));
          },
          onerror: (err: any) => {
            console.error("[WS] Gemini session error:", err);
            clientWs.send(JSON.stringify({ type: "error", error: "Gemini server encountered an error" }));
          },
        },
      });

      clientWs.send(JSON.stringify({ type: "status", status: "session-connected" }));
      console.log("[WS] Connected to Gemini Live session successfully");

    } catch (err: any) {
      console.error("[WS] Error starting Gemini Live connection:", err);
      clientWs.send(JSON.stringify({ type: "error", error: `Connection failed: ${err.message || err}` }));
      clientWs.close();
      return;
    }

    clientWs.on("message", (rawMsg) => {
      if (!session) return;
      try {
        const message = JSON.parse(rawMsg.toString());
        if (message.type === "audio" && message.audio) {
          session.sendRealtimeInput({
            audio: {
              data: message.audio,
              mimeType: "audio/pcm;rate=16000"
            }
          });
        } else if (message.type === "text" && message.text) {
          session.sendRealtimeInput({
            text: message.text
          });
        }
      } catch (err: any) {
        console.error("[WS] Error processing incoming client payload:", err);
      }
    });

    clientWs.on("close", () => {
      console.log("[WS] Client closed connection, shutting down Gemini Live session");
      if (session) {
        try {
          session.close();
        } catch (e) {
          // ignore
        }
      }
    });
  });

  // Serve static assets/Vite pages based on environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[HTTP] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
