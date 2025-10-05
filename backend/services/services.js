import { Pinecone } from '@pinecone-database/pinecone';
import { pipeline } from '@xenova/transformers';
import Groq from 'groq-sdk';
import { PINECONE_API_KEY, GROQ_API_KEY } from '../config/config.js';

export const groq = new Groq({ apiKey: GROQ_API_KEY });
let pinecone = null;
let index = null;
let embedder = null;

// Initialize Pinecone database
export async function initPinecone() {
  if (!PINECONE_API_KEY) return false;
  try {
    pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
    index = pinecone.index('github-projects');
    console.log('✅ Pinecone RAG enabled');
    return true;
  } catch (error) {
    console.warn('⚠️  Pinecone unavailable');
    return false;
  }
}

// Get text embedder for semantic search
export async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}
