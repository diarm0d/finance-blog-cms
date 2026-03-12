import { NextResponse } from "next/server";
import { createClient } from "@/prismicio";

export const dynamic = "force-dynamic"; // Ensure it's never cached

export async function GET() {
  const startTime = Date.now();
  
  try {
    const client = createClient();
    
    // 1. Dependency Check: Can we talk to Prismic?
    // We do a lightweight 'repository' fetch to check connectivity
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
    // 2. Failure Reporting
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