import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    channelId: string;
  }>;
};

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const profile = await currentProfile();
    const { channelId } = await params; 
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID is required", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_DELETE_ERROR]", error);
    return new NextResponse("Could not delete channel", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const profile = await currentProfile();
    const { channelId } = await params; 
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID is required", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: { name: "general" },
            },
            data: { name, type },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_PATCH_ERROR]", error);
    return new NextResponse("Could not update channel", { status: 500 });
  }
}
