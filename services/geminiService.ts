import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

/**
 * Initializes the chat session with the Gemini API.
 * It uses the system instruction defined in constants.
 */
const getChatSession = (): Chat => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not defined in process.env");
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return chatSession;
};

/**
 * Sends a message to the Gemini model and yields chunks of text as they stream in.
 */
export const sendMessageStream = async function* (message: string) {
  try {
    const chat = getChatSession();
    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
        // Cast chunk to GenerateContentResponse to access properties safely
        const responseChunk = chunk as GenerateContentResponse;
        if (responseChunk.text) {
            yield responseChunk.text;
        }
    }
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    yield "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};