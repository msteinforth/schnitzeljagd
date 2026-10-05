import { createHunt, listHunts, type CreateHuntInput } from "@/server/hunts";
import { readJson, withUser } from "@/server/http";

export async function GET() {
  return withUser(async (userId) => Response.json(await listHunts(userId)));
}

export async function POST(request: Request) {
  return withUser(async (userId) => {
    const hunt = await createHunt(userId, (await readJson(request)) as CreateHuntInput);
    return Response.json(hunt, { status: 201 });
  });
}
