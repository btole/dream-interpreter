import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import Groq from "groq-sdk";
const envPath = fileURLToPath(new URL('../.env', import.meta.url));
if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

const openai = new Groq({
  apiKey: process.env.AI_KEY,
  apiUrl: process.env.AI_URL || 'https://api.groq.com/openai/v1',
  defaultModel: process.env.AI_MODEL || 'openai/gpt-oss-120b'
})

// Call OpenAI API for dream interpretation
export async function getDreamInterpretation(dreamText) {
  if (!process.env.AI_KEY) {
    throw new Error('Server misconfigured: AI_KEY is missing');
  }

  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  try {
    const message = await openai.chat.completions.create({
      model,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: 'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.'
        },
        {
          role: 'user',
          content: `Dream: ${dreamText}`
        }
      ]
    });
    return message.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`API error: ${error.message}`);
  }
}
