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

const formSchema = z.object({
  content: z.string().min(1).max(2000, "Message is too long"),
});

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

      // Optimistic update: añade el mensaje inmediatamente
      const chatId = query.channelId || query.conversationId;
      const queryKey = `chat:${chatId}`;

      // Crea un mensaje temporal
      const tempMessage = {
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

      // Actualiza la caché inmediatamente
      queryClient.setQueryData([queryKey], (oldData: any) => {
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

      // Scroll al fondo inmediatamente
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("chat-scroll-to-bottom"));
      }, 0);

      // Limpia el form inmediatamente
      form.reset();

      // Envía al servidor en segundo plano
      await axios.post(url, data);

      // El socket actualizará con el mensaje real
      router.refresh();
    } catch (error) {
      console.log(error);
      // Si falla, revertir el optimistic update
      form.setValue("content", data.content);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
