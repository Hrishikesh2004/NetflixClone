import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string[] }> }
) {
  const { endpoint } = await params;
  const path = endpoint.join("/");
  const searchParams = request.nextUrl.searchParams;

  const apiKey = process.env.TMDB_API_KEY;
  const apiToken = process.env.TMDB_READ_ACCESS_TOKEN;

  if (!apiKey && !apiToken) {
    return NextResponse.json(
      { error: "TMDB API credentials not configured on server" },
      { status: 503 }
    );
  }

  const tmdbUrl = new URL(`${TMDB_BASE_URL}/${path}`);
  searchParams.forEach((val: string, key: string) => {
    tmdbUrl.searchParams.append(key, val);
  });

  if (apiKey) {
    tmdbUrl.searchParams.append("api_key", apiKey);
  }

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (apiToken && !apiKey) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  }

  try {
    const res = await fetch(tmdbUrl.toString(), {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB responded with status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch from TMDB";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
