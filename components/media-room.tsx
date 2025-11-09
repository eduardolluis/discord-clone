"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  audio: boolean;
  video: boolean;
}

export const MediaRoom = ({ chatId, audio, video }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.firstName && !user?.lastName) return;

    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.username ||
      "Anonymous";

    (async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${encodeURIComponent(name)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.status}`);
        }

        const data = await response.json();

        if (!data.token) {
          throw new Error("No token received from server");
        }

        setToken(data.token);
      } catch (error) {
        console.error("LiveKit token error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load video chat"
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.firstName, user?.lastName, user?.username, chatId]);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-sm text-red-500">Error: {error}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          Please check your LiveKit configuration
        </p>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_LIVEKIT_URL) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-sm text-red-500">LiveKit URL not configured</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          Add NEXT_PUBLIC_LIVEKIT_URL to your .env file
        </p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
