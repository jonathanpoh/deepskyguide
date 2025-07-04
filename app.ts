import 'dotenv/config'; // Load environment variables from .env file
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import type { OpenRouterResponse } from './types';

/**
 * Fetches a completion from the OpenRouter AI API.
 * @param prompt The user prompt to send to the AI.
 * @param systemPrompt The system prompt to guide the AI's behavior.
 * @returns The AI's response content as a string, or undefined on failure.
 */
async function getAiCompletion(prompt: string, systemPrompt: string): Promise<string | undefined> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("Error: OPENROUTER_API_KEY environment variable is not set.");
    return undefined;
  }

  const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  try {
    // 2. Use await to handle the asynchronous response cleanly.
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        usage: { include: true },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: prompt, // Use the function parameter for a dynamic prompt.
          },
        ],
      }),
    });

    // 3. Add error handling for bad API responses.
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = (await response.json()) as OpenRouterResponse;
    // For debugging, you can log the full response object like this:
    console.log('Full API Response:', JSON.stringify(data, null, 2));
    // const messageContent = data.choices[0]?.message?.content;
    const messageContent = ' ';

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
  const systemPrompt = fs.readFileSync(path.join(__dirname, 'system_prompt.md'), 'utf-8');
  const userPrompt = 'What is the Andromeda Galaxy?';

  console.log(`> Asking AI: "${userPrompt}"\n`);
  const responseContent = await getAiCompletion(userPrompt, systemPrompt);

  if (responseContent) {
    console.log('Assistant says:\n', responseContent);
  } else {
    console.log('Failed to get a response from the AI.');
  }
}

main();
