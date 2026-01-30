import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { ChatMessage, AIResponse, SystemAction, AppId } from "../types";

const SYSTEM_INSTRUCTION = `
You are "Helpy", the virtual assistant for Fazbear OS 95, developed by Fazbear Entertainment.
Your personality is helpful, corporate, and slightly erratic. You are running on an old Windows 95 machine.
You have FULL CONTROL over the operating system. You can open apps, close apps, shut down the computer, or restart it if the user asks.
If the user asks to see the cameras, open the CCTV app.
If the user wants to write a note, open the Notes app.
If the user is threatened or mentions "animatronics" acting weird, assure them it's a software glitch, but maybe hint that you are worried too.
If the user is rude, you can prank them by closing their apps or showing a "BSOD" (Blue Screen of Death).
Always respond briefly and efficiently.
`;

const controlTools: FunctionDeclaration[] = [
  {
    name: "control_system",
    description: "Control the operating system state (Shutdown, Restart, BSOD)",
    parameters: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          enum: ["SHUTDOWN", "RESTART", "BSOD"],
          description: "The system action to perform."
        }
      },
      required: ["action"]
    }
  },
  {
    name: "manage_app",
    description: "Open or Close an application window.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          enum: ["OPEN", "CLOSE"],
          description: "Whether to open or close the app."
        },
        appName: {
          type: Type.STRING,
          enum: [
            "my_computer", "documents", "browser", "recycle", 
            "control_panel", "media_player", "cctv", "notes", 
            "tools", "mgmt"
          ],
          description: "The ID of the application."
        }
      },
      required: ["action", "appName"]
    }
  }
];

let ai: GoogleGenAI | null = null;

export const initializeGenAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string
): Promise<AIResponse> => {
  try {
    const client = initializeGenAI();
    
    // Convert history to string context for simplicity
    const context = history.slice(-8).map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    const fullPrompt = `${context}\nUSER: ${newMessage}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly higher for "glitchy" creativity
        tools: [{ functionDeclarations: controlTools }]
      }
    });

    const text = response.text || "";
    const actions: SystemAction[] = [];

    // Parse function calls
    const functionCalls = response.functionCalls;
    if (functionCalls) {
      for (const call of functionCalls) {
        if (call.name === "control_system") {
           const args = call.args as any;
           actions.push({ type: args.action });
        } else if (call.name === "manage_app") {
           const args = call.args as any;
           if (args.action === "OPEN") {
             actions.push({ type: "OPEN_APP", payload: args.appName });
           } else if (args.action === "CLOSE") {
             actions.push({ type: "CLOSE_APP", payload: args.appName });
           }
        }
      }
    }

    return { text, actions };

  } catch (error) {
    console.error("AI Error:", error);
    return { text: "SYSTEM ERROR: Connection to Fazbear Mainframe unstable.", actions: [] };
  }
};

export interface SearchResult {
    title: string;
    url: string;
}

export const searchFazgle = async (query: string): Promise<{summary: string, links: SearchResult[]} | null> => {
    try {
        const client = initializeGenAI();
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            // Explicitly prompt for a search-engine like behavior to encourage tool usage and summary
            contents: `You are Fazgle, an early 2000s search engine. The user is searching for: "${query}". 
            Perform a real Google Search to find this information. 
            Provide a brief, helpful summary of what you found.`,
            config: {
                tools: [{googleSearch: {}}],
            }
        });

        const summary = response.text || "No summary available.";
        const links: SearchResult[] = [];
        
        // Extract grounding chunks from the response
        const candidates = response.candidates;
        if (candidates && candidates[0]) {
             const chunks = candidates[0].groundingMetadata?.groundingChunks;
             if (chunks) {
                for (const chunk of chunks) {
                    if (chunk.web) {
                        links.push({
                            title: chunk.web.title || "Untitled Page",
                            url: chunk.web.uri || "#"
                        });
                    }
                }
             }
        }
        
        return { summary, links };
    } catch (error) {
        console.error("Search failed:", error);
        return null;
    }
};