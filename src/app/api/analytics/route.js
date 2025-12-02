import { getAnalytics } from "./server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d";

  const data = await getAnalytics({ period });
  return Response.json(data);
}
