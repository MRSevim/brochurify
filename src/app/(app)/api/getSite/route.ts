import { getSite } from "@/utils/serverActions/siteActions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Missing domain parameter." },
        { status: 400 }
      );
    }

    const site = await getSite(domain);

    return NextResponse.json(site, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
