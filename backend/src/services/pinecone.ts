import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const indexName = process.env.PINECONE_INDEX || 'chat-embeddings-1024';

export interface ChatMetadata {
  chatId: string;
  promptName: string;
  promptId: string;
  category: string;
  summary: string;
  keyTopics: string[];
  date: string;
  messageCount: number;
  conversationText: string;
}

// Create namespace from prompt name (sanitize for Pinecone)
function sanitizeNamespace(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64);
}

export async function storeChatEmbedding(
  embedding: number[],
  metadata: ChatMetadata
): Promise<void> {
  const index = pinecone.index(indexName);
  const namespace = sanitizeNamespace(metadata.promptName);

  await index.namespace(namespace).upsert([
    {
      id: metadata.chatId,
      values: embedding,
      metadata: {
        promptName: metadata.promptName,
        promptId: metadata.promptId,
        category: metadata.category,
        summary: metadata.summary,
        keyTopics: metadata.keyTopics,
        date: metadata.date,
        messageCount: metadata.messageCount,
        // Store first 1000 chars of conversation for retrieval
        conversationPreview: metadata.conversationText.slice(0, 1000),
      },
    },
  ]);

  console.log(`Stored chat ${metadata.chatId} in namespace ${namespace}`);
}

export async function searchSimilarChats(
  embedding: number[],
  promptName?: string,
  topK: number = 5
): Promise<Array<{
  id: string;
  score: number;
  metadata: Record<string, unknown>;
}>> {
  const index = pinecone.index(indexName);
  
  const queryOptions: {
    vector: number[];
    topK: number;
    includeMetadata: boolean;
  } = {
    vector: embedding,
    topK,
    includeMetadata: true,
  };

  let results;
  if (promptName) {
    const namespace = sanitizeNamespace(promptName);
    results = await index.namespace(namespace).query(queryOptions);
  } else {
    results = await index.query(queryOptions);
  }

  return (results.matches || []).map(match => ({
    id: match.id,
    score: match.score || 0,
    metadata: match.metadata || {},
  }));
}

export async function listNamespaces(): Promise<string[]> {
  const index = pinecone.index(indexName);
  const stats = await index.describeIndexStats();
  
  return Object.keys(stats.namespaces || {});
}

