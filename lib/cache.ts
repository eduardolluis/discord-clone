import { cache } from "react";
import { db } from "@/lib/db";

// Caché para perfil actual
export const getCurrentProfile = cache(async (userId: string) => {
  return await db.profile.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      name: true,
      imageUrl: true,
      email: true,
    },
  });
});

// Caché para servidor con miembros
export const getServerWithMembers = cache(
  async (serverId: string, profileId: string) => {
    return await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profileId,
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
  }
);

// Caché para canal
export const getChannel = cache(async (channelId: string) => {
  return await db.channel.findUnique({
    where: { id: channelId },
    select: {
      id: true,
      name: true,
      type: true,
      serverId: true,
    },
  });
});

// Caché para miembro
export const getMember = cache(async (serverId: string, profileId: string) => {
  return await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profileId,
    },
    select: {
      id: true,
      role: true,
      profileId: true,
      serverId: true,
      profile: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });
});

// Caché para servidores del usuario
export const getUserServers = cache(async (profileId: string) => {
  return await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
    orderBy: {
      CreatedAt: "asc",
    },
  });
});

// Caché para conversación
export const getConversation = cache(
  async (memberOneId: string, memberTwoId: string) => {
    return await db.conversation.findFirst({
      where: {
        OR: [
          {
            AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
          },
          {
            AND: [{ memberOneId: memberTwoId }, { memberTwoId: memberOneId }],
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
);
