// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';
import dotenv from "dotenv";

dotenv.config();

export async function googleGenAi(skinType: string, sunExposure: string, immuneHealth: string, history: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: 'text/plain',
    maxOutputTokens: 500,
  };
  const model = 'gemini-2.0-flash-lite';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Explain how the following parameter affects likelihood of melanoma
          1st Parameter ${skinType} -> This is about fitzpatrick scale study 
          2nd Parameter ${sunExposure} -> Based on the user skin type recommend sun exposure limit
          3rd Parameter ${immuneHealth} -> Talks about the weakness of users health
          4th Parameter ${history}  -> Family History of melanoma increases chances of having melanoma also.
          Only talk about the particular parameter if it applies.
          No need for trivia please do go straight to the point maximum of 300 words 
          Give general recommendations on how to avoid melanoma. 
          Make sure your response is for the user and put it on essay form`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fullResponse = ''; 
  for await (const chunk of response) {
    console.log(chunk.text);
    fullResponse += chunk.text || '';
  }

  return fullResponse;
}
