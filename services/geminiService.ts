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
    // Clean base64 string if it contains the data URI prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
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