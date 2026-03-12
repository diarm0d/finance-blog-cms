import { NextResponse } from "next/server";
import { createClient } from "@/prismicio";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  
  try {
    const client = createClient();
    await client.getRepository();

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        latency: `${Date.now() - startTime}ms`,
        uptime: process.uptime(),
        dependencies: {
          prismic: "up",
        },
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: `Dependency failure: ${error}`,
        dependencies: {
          prismic: "down",
        },
      },
      { status: 503 } 
    );
  }
}