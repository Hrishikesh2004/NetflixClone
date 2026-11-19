import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ items: [] });
  }

  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { data: wl } = await supabase
      .from("watchlists")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!wl) {
      return NextResponse.json({ items: [] });
    }

    const { data: items, error } = await supabase
      .from("watchlist_items")
      .select("*")
      .eq("watchlist_id", wl.id)
      .order("added_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: items || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
