import { GoogleGenAI, Content } from "@google/genai";
import { Event } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEventDescription = async (title: string, category: string): Promise<string> => {
  const prompt = `Generate a compelling and concise event description for an event titled "${title}" in the category of "${category}". The description should be around 2-3 sentences long, highlighting the key aspects and creating excitement. Do not use markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating event description:", error);
    return "There was an error generating the description. Please try again.";
  }
};

export const generateEventImage = async (prompt: string): Promise<string> => {
  const fullPrompt = `A vibrant and professional event poster for: "${prompt}". Minimalist, exciting, high quality, commercial photography.`;
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating event image:", error);
    // Return a placeholder on error
    return "https://picsum.photos/seed/error/400/250";
  }
};

export const getChatbotResponse = async (query: string, events: Event[], chatHistory: Content[]): Promise<string> => {
    const eventList = events.map(e => `- ${e.title} on ${e.date.toLocaleDateString()} at ${e.location} for $${e.ticketPrice}. Category: ${e.category}. Seats left: ${e.seatsAvailable}`).join('\n');

    const contents = [
        ...chatHistory,
        { role: 'user', parts: [{ text: query }] }
    ];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: `You are EventEase's friendly chatbot assistant. Your goal is to help users find information about events. Be concise and helpful. Today's date is ${new Date().toLocaleDateString()}. Here is a list of available events:\n${eventList}\n\nAnswer the user's questions based on this list. If you don't know the answer, say that you cannot find that information. Do not make up event details.`,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error with chatbot:", error);
        return "I'm having a little trouble right now. Please try again later.";
    }
}