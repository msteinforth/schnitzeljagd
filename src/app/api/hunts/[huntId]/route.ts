import { deleteHunt, getHunt, updateHunt, type UpdateHuntInput } from "@/server/hunts";
import { readJson, withUser } from "@/server/http";

export async function GET(_request: Request, ctx: RouteContext<"/api/hunts/[huntId]">) {
  const { huntId } = await ctx.params;
  return withUser(async (userId) => Response.json(await getHunt(userId, huntId)));
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/hunts/[huntId]">) {
  const { huntId } = await ctx.params;
  return withUser(async (userId) => {
    const input = (await readJson(request)) as UpdateHuntInput;
    return Response.json(await updateHunt(userId, huntId, input));
  });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/hunts/[huntId]">) {
  const { huntId } = await ctx.params;
  return withUser(async (userId) => {
    await deleteHunt(userId, huntId);
    return new Response(null, { status: 204 });
  });
}
