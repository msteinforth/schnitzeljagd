import { errorResponse } from "@/server/http";
import { getRunForPlayer } from "@/server/runs";

export async function GET(_request: Request, ctx: RouteContext<"/api/play/[token]">) {
  const { token } = await ctx.params;
  try {
    return Response.json(await getRunForPlayer(token));
  } catch (error) {
    return errorResponse(error);
  }
}
