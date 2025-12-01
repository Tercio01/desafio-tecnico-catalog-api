import dotenv from 'dotenv';
import path from 'path';

// Carregar .env.test antes de qualquer coisa
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

console.log('[JEST-SETUP] NODE_ENV:', process.env.NODE_ENV);
console.log('[JEST-SETUP] MONGODB_URI:', process.env.MONGODB_URI);
