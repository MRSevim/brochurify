import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { protect } from "@/utils/serverActions/helpers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    const user = await protect(token);

    const response = NextResponse.json(user);

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
