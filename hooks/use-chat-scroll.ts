import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatscroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topDiv = chatRef.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [chatRef, shouldLoadMore, loadMore]);

  useEffect(() => {
    const handleScrollEvent = () => {
      const topDiv = chatRef.current;
      if (topDiv) {
        setTimeout(() => {
          topDiv.scrollTop = topDiv.scrollHeight;
        }, 100);
      }
    };

    window.addEventListener("chat-scroll-to-bottom", handleScrollEvent);

    return () => {
      window.removeEventListener("chat-scroll-to-bottom", handleScrollEvent);
    };
  }, [chatRef]);

  useEffect(() => {
    const topDiv = chatRef.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && topDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        if (topDiv) {
          topDiv.scrollTop = topDiv.scrollHeight;
        }
      }, 100);
    }
  }, [chatRef, count, hasInitialized]);
};
