import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
import type { OpenRouterResponse } from './types.ts';

/**
 * Fetches a completion from the OpenRouter AI API.
 * @param prompt The user prompt to send to the AI.
 * @param systemPrompt The system prompt to guide the AI's behavior.
 * @returns The AI's response content as a string, or undefined on failure.
 */
async function getAiCompletion(prompt: string, systemPrompt: string): Promise<string | undefined> {
  // In Deno, you can load from a file or use Deno.env
  const env = await load();
  const apiKey = env['OPENROUTER_API_KEY'] ?? Deno.env.get('OPENROUTER_API_KEY');

  if (!apiKey) {
    console.error("Error: OPENROUTER_API_KEY environment variable is not set.");
    return undefined;
  }

  const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001', // The 'usage' parameter is not supported by this model.
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: prompt, // Use the function parameter for a dynamic prompt.
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = (await response.json()) as OpenRouterResponse;
    // For debugging, you can log the full response object like this:
    // console.log('Full API Response:', JSON.stringify(data, null, 2));
    const messageContent = data.choices[0]?.message?.content;

    if (!messageContent) {
      console.error('Could not find message content in the AI response.');
      return undefined;
    }

    return messageContent.trim();

  } catch (error) {
    console.error('An error occurred while fetching the AI completion:', error);
    return undefined;
  }
}

/**
 * Main execution function.
 */
async function main() {
  // Deno uses `import.meta.url` to resolve paths relative to the current file.
  const systemPromptPath = new URL('system_prompt.md', import.meta.url);
  const systemPrompt = await Deno.readTextFile(systemPromptPath);

  const userPrompt = 'What is the Andromeda Galaxy?'; // Or read from Deno.args

  console.log(`> Asking AI: "${userPrompt}"\n`);
  const responseContent = await getAiCompletion(userPrompt, systemPrompt);

  if (responseContent) {
    console.log('Assistant says:\n', responseContent);
  } else {
    console.log('Failed to get a response from the AI.');
  }
}

main();
