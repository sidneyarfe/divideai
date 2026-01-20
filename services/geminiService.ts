import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

const processReceiptImage = async (base64Image: string): Promise<ExtractedData> => {
  // Using the specific API key provided to resolve authentication/entity not found errors
  const apiKey = "AIzaSyDv1d4JtyZUHM1CUYBwQgfuhUNBV4MD0II";
  
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Role: Especialista em Extração de Dados Gastronômicos.
    Task: Converter a imagem do recibo em um objeto JSON.
    Constraint: Não inclua explicações.
    Constraint: Garanta que todos os valores numéricos sejam números (number), não strings.
    Constraint: Inclua 'Couvert Artístico', 'Couvert', 'Estacionamento' ou outras taxas fixas como ITENS na lista de 'itens'.
    Constraint: A 'taxa_servico_original' deve ser apenas a PORCENTAGEM (ex: 10, 12, 13). Se for um valor monetário fixo, converta para porcentagem aproximada ou inclua como item se for uma taxa fixa não percentual.
    Output JSON Schema:
    {
      "estabelecimento": "string",
      "itens": [{"nome": "string", "valor_total": number, "quantidade": number}],
      "taxa_servico_original": number, // A porcentagem (ex: 10 para 10%)
      "total_geral": number
    }
  `;

  try {
    // Robust extraction of Base64 data and MIME type
    // This fixes issues with iPhone images (HEIC) or other formats that didn't match the previous Regex
    let cleanBase64 = base64Image;
    let mimeType = 'image/jpeg'; // Default fallback

    if (base64Image.includes(',')) {
      const parts = base64Image.split(',');
      // The content is always after the comma
      cleanBase64 = parts[1];
      
      // Try to extract the actual mime type from the header (e.g., "data:image/png;base64")
      const header = parts[0];
      const mimeMatch = header.match(/:([a-zA-Z0-9\/]+);/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estabelecimento: { type: Type.STRING },
            itens: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  valor_total: { type: Type.NUMBER },
                  quantidade: { type: Type.NUMBER }
                }
              }
            },
            taxa_servico_original: { type: Type.NUMBER },
            total_geral: { type: Type.NUMBER }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    const data = JSON.parse(text) as ExtractedData;
    return data;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to extract data from receipt.");
  }
};

export { processReceiptImage };