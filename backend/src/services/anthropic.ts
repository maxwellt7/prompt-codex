import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function createChatCompletion(
  systemPrompt: string,
  messages: Message[]
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  // Extract text from response
  const textContent = response.content.find(c => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Anthropic');
  }

  return textContent.text;
}

export async function createStreamingChatCompletion(
  systemPrompt: string,
  messages: Message[],
  onChunk: (chunk: string) => void
): Promise<string> {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  let fullResponse = '';

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      const text = event.delta.text;
      fullResponse += text;
      onChunk(text);
    }
  }

  return fullResponse;
}

// Generate a summary of the conversation for metadata
export async function generateConversationSummary(messages: Message[]): Promise<{
  summary: string;
  keyTopics: string[];
}> {
  const conversationText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n\n');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: 'You are a helpful assistant that summarizes conversations. Respond in JSON format only.',
    messages: [
      {
        role: 'user',
        content: `Summarize this conversation in a brief paragraph and extract 3-5 key topics discussed. Respond ONLY with valid JSON in this exact format:
{"summary": "...", "keyTopics": ["topic1", "topic2", ...]}

Conversation:
${conversationText}`,
      },
    ],
  });

  const textContent = response.content.find(c => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    return { summary: 'Conversation completed', keyTopics: [] };
  }

  try {
    const parsed = JSON.parse(textContent.text);
    return {
      summary: parsed.summary || 'Conversation completed',
      keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics : [],
    };
  } catch {
    return { summary: 'Conversation completed', keyTopics: [] };
  }
}

