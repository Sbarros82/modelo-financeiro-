import { GoogleGenAI, Type } from "@google/genai";
import { Lancamento } from '../types';

export const generateFinancialData = async (year: number): Promise<Lancamento[]> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere uma lista de 60 a 80 lançamentos financeiros para o ano de ${year} em Português do Brasil.
      As categorias devem incluir 'INSS', 'Empréstimos', 'Estorno de Serviço', 'Salários', 'Fornecedores', 'Impostos', 'Aluguel', e 'Receita de Vendas'.
      A categoria 'RESULTADO ASOS' deve ter 2 a 3 lançamentos com valores pequenos e negativos.
      'Receita de Vendas' deve ser sempre positiva, representando a entrada de dinheiro. Todas as outras categorias devem ter principalmente valores negativos (despesas).
      As filiais devem ser 'Matriz', 'Filial BH', ou 'Filial AL'.
      Os dados devem ser realistas para uma pequena empresa, com transações distribuídas ao longo dos meses de Janeiro a Novembro, com alguns meses sem transações para algumas categorias.
      Gere um ID único para cada lançamento.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'ID único do lançamento' },
              categoria: { type: Type.STRING, description: 'Categoria do lançamento' },
              data: { type: Type.STRING, description: 'Data no formato YYYY-MM-DD' },
              descricao: { type: Type.STRING, description: 'Descrição do lançamento' },
              origem: { type: Type.STRING, description: 'Origem (banco, fornecedor, etc.)' },
              filial: { type: Type.STRING, description: 'Filial de origem' },
              valor: { type: Type.NUMBER, description: 'Valor do lançamento (negativo para despesa)' },
            },
            required: ['id', 'categoria', 'data', 'descricao', 'origem', 'filial', 'valor'],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText) as Lancamento[];
    return data;
  } catch (error) {
    console.error("Error generating financial data with Gemini:", error);
    throw new Error("Falha ao gerar dados financeiros. Verifique a chave de API e a conexão.");
  }
};