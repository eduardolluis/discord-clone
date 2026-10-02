import { NextRequest, NextResponse } from "next/server";
import { ChannelType } from "@prisma/client";
import { AccessToken } from "livekit-server-sdk";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const profile = await currentProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const room = req.nextUrl.searchParams.get("room");

  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const [channel, conversation] = await Promise.all([
    db.channel.findFirst({
      where: {
        id: room,
        type: { in: [ChannelType.AUDIO, ChannelType.VIDEO] },
        server: {
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
      },
      select: { id: true },
    }),
    db.conversation.findFirst({
      where: {
        id: room,
        OR: [
          { memberOne: { profileId: profile.id } },
          { memberTwo: { profileId: profile.id } },
        ],
      },
      select: { id: true },
    }),
  ]);

  if (!channel && !conversation) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: profile.id,
    name: profile.name,
  });

  token.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return NextResponse.json(
    { token: await token.toJwt() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
