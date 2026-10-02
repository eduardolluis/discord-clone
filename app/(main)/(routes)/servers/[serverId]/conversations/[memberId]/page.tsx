import { redirect } from "next/navigation";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { getOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db";

interface MemberIdPageProps {
  params: Promise<{
    memberId: string;
    serverId: string;
  }>;
  searchParams: Promise<{
    video?: string;
  }>;
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const { memberId, serverId } = await params;
  const resolvedSearchParams = await searchParams;
  const isVideo = resolvedSearchParams.video === "true";

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const [currentMember, targetMember] = await Promise.all([
    db.member.findFirst({
      where: {
        serverId,
        profileId: profile.id,
      },
      include: {
        profile: true,
      },
    }),
    db.member.findFirst({
      where: {
        id: memberId,
        serverId,
      },
      include: {
        profile: true,
      },
    }),
  ]);

  if (
    !currentMember ||
    !targetMember ||
    currentMember.id === targetMember.id
  ) {
    return redirect(`/servers/${serverId}`);
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    targetMember.id
  );

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      {isVideo ? (
        <MediaRoom chatId={conversation.id} audio={true} video={true} />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
