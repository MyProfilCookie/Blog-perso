import { NextResponse } from "next/server";

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  
  return NextResponse.json({
    keyPresent: !!groqKey,
    keyLength: groqKey?.length || 0,
    keyPrefix: groqKey ? groqKey.substring(0, 7) + "..." : "none",
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('GROQ') || key.includes('API')).slice(0, 10)
  });
}

