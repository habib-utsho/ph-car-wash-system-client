// Base URL of the Express backend, for example http://localhost:5000.
// Set NEXT_PUBLIC_API_URL in .env (see .env.example).
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set. Add it to .env (see .env.example).");
}
