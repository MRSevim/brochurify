import { NextResponse } from "next/server";
import { protect } from "@/features/auth/utils/helpers";

export async function GET() {
  try {
    const user = await protect();

    const response = NextResponse.json(user);

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
