"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmojiPicker } from "@/components/emoji-picker";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs, { type StringifiableRecord } from "query-string";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useQueryClient } from "@tanstack/react-query";

interface ChatInputProps {
  apiUrl: string;
  query: StringifiableRecord;
  name: string;
  type: "conversation" | "channel";
}

type ChatProfile = {
  id: string;
  name: string;
  imageUrl?: string;
  email?: string;
};

type ChatMember = {
  id: string;
  role: string;
  profile: ChatProfile;
};

type ChatMessage = {
  id: string;
  content: string;
  fileUrl: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  member: ChatMember;
};

type ChatPage = {
  items: ChatMessage[];
};

type ChatPages = {
  pages: ChatPage[];
};

const formSchema = z.object({
  content: z.string().min(1).max(2000, "Message is too long"),
});

const isChannelQuery = (
  query: StringifiableRecord
): query is StringifiableRecord & { channelId: string } => {
  return typeof (query as Record<string, unknown>).channelId === "string";
};

const isConversationQuery = (
  query: StringifiableRecord
): query is StringifiableRecord & { conversationId: string } => {
  return typeof (query as Record<string, unknown>).conversationId === "string";
};

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      let chatId: string | undefined;
      if (isChannelQuery(query)) chatId = query.channelId;
      else if (isConversationQuery(query)) chatId = query.conversationId;

      if (!chatId) throw new Error("Missing chat identifier");

      const queryKey = `chat:${chatId}`;

      const tempMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        content: data.content,
        fileUrl: null,
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        member: {
          id: "temp-member",
          role: "GUEST",
          profile: {
            id: "temp-profile",
            name: "You",
            imageUrl: "",
            email: "",
          },
        },
      };

      queryClient.setQueryData<ChatPages | undefined>([queryKey], (oldData) => {
        if (!oldData?.pages?.length) {
          return { pages: [{ items: [tempMessage] }] };
        }

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          items: [tempMessage, ...newPages[0].items],
        };

        return { ...oldData, pages: newPages };
      });

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("chat-scroll-to-bottom"));
      }, 0);

      form.reset();

      await axios.post(url, data);

      router.refresh();
    } catch (error) {
      console.error(error);
      form.setValue("content", data.content);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen("MESSAGE_FILE", {
                        apiUrl,
                        query: qs.stringify(query),
                      })
                    }
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
