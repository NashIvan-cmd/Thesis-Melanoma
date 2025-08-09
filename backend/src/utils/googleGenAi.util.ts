// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';
import dotenv from "dotenv";

dotenv.config();

export async function googleGenAi(stringValueOfModelAssessment: string, skinType: string, sunExposure: string, immuneHealth: string, history: string) {
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
          text:
           `You are given a main melanoma risk assessment result: **${stringValueOfModelAssessment}**.
          Explain how this primary condition relates to the user's individual risk of melanoma this is a model prediction that ranges 0-1 that is times into 100.

          Use the following subparameters to support your explanation **only if they are relevant** to the main condition:
          1. **Skin Type** (${skinType}) — Reflects the user's Fitzpatrick classification. Consider how this affects sensitivity to UV damage and melanoma likelihood.
          2. **Sun Exposure** (${sunExposure}) — Evaluate whether the user’s reported exposure level increases or decreases their risk, considering their skin type and the main assessment.
          3. **Immune Health** (${immuneHealth}) — Discuss whether the user's immune status amplifies melanoma risk based on the given condition.
          4. **Family History** (${history}) — Consider if a genetic predisposition contributes to the current assessment.

          Write in concise essay form (maximum 300 words), focused only on relevant parameters. Avoid unrelated details or trivia. End with **general, practical recommendations** for reducing melanoma risk.`
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

