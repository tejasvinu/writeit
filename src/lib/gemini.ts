import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a standard model instead of experimental one
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21", // or "gemini-1.5-flash" for faster responses
});

export const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

export async function chat(messages: { role: 'user' | 'model', content: string }[]) {
  try {
    // For simple prompts, using a direct generation approach might be more reliable
    if (messages.length === 1 && messages[0].role === 'user') {
      const result = await model.generateContent(messages[0].content);
      const response = await result.response;
      const text = response.text();
      return {
        role: 'model' as const,
        content: text,
      };
    } 
    // For multi-turn conversations, use chat
    else {
      const history = messages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{text: msg.content}]
      }));
      
      const chatSession = model.startChat({
        generationConfig,
        history: history.length > 0 ? history : undefined,
      });
    
      const lastMessage = messages[messages.length - 1];
      const result = await chatSession.sendMessage(lastMessage.content);
      const text = result.response.text();
      
      return {
        role: 'model' as const,
        content: text,
      };
    }
  } catch (error) {
    console.error('Error in Gemini chat:', error);
    throw error;
  }
}