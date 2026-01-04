import { CohereClient } from 'cohere-ai';

// Initialize Cohere lazily only if API key is available
let cohereClient: CohereClient | null = null;

function getCohere(): CohereClient {
  if (!process.env.COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY not configured - embedding functionality disabled');
  }
  
  if (!cohereClient) {
    cohereClient = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
  }
  
  return cohereClient;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const cohere = getCohere();
  
  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType: 'search_document',
  });

  // The embeddings property contains the vectors
  if (!response.embeddings || !Array.isArray(response.embeddings) || response.embeddings.length === 0) {
    throw new Error('No embeddings returned from Cohere');
  }

  // embed-english-v3.0 returns 1024 dimensions which matches our Pinecone index
  const embedding = response.embeddings[0];
  
  if (!Array.isArray(embedding)) {
    throw new Error('Invalid embedding format from Cohere');
  }
  
  return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const cohere = getCohere();
  
  const response = await cohere.embed({
    texts,
    model: 'embed-english-v3.0',
    inputType: 'search_document',
  });

  if (!response.embeddings || !Array.isArray(response.embeddings)) {
    throw new Error('No embeddings returned from Cohere');
  }

  return response.embeddings as number[][];
}
