import { useEffect } from "react";
import { useSocket } from "@/components/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { Member, Message, Profile } from "@prisma/client";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

// Estructura que React Query devuelve cuando usas paginación
interface InfiniteMessages {
  pages: {
    items: MessageWithMemberWithProfile[];
  }[];
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<InfiniteMessages>([queryKey], (oldData) => {
        if (!oldData?.pages?.length) return oldData;

        const newPages = oldData.pages.map((page) => ({
          ...page,
          items: page.items.map((item) =>
            item.id === message.id ? message : item
          ),
        }));

        return { ...oldData, pages: newPages };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<InfiniteMessages>([queryKey], (oldData) => {
        if (!oldData?.pages?.length) {
          return { pages: [{ items: [message] }] };
        }

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          items: [message, ...newPages[0].items],
        };

        return { ...oldData, pages: newPages };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, queryClient, addKey, updateKey, queryKey]);
};
