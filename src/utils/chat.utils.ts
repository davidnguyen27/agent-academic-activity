export const simulateTypewriterEffect = (
  fullText: string,
  updateMessages: (
    callback: (
      prev: { role: "user" | "assistant"; content: string }[]
    ) => { role: "user" | "assistant"; content: string }[]
  ) => void,
  doneTyping: () => void,
  scrollRef?: React.RefObject<HTMLDivElement | null>
) => {
  const characters = [...fullText];
  let index = 0;

  updateMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  const typingInterval = setInterval(() => {
    updateMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last.role === "assistant") {
        updated[updated.length - 1] = {
          ...last,
          content: last.content + characters[index],
        };
      }
      return updated;
    });

    index++;
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });

    if (index >= characters.length) {
      clearInterval(typingInterval);
      doneTyping();
    }
  }, 20);
};

export const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};

export const createTypingDotsEffect = (setDots: (dots: string) => void) => {
  let count = 0;
  const interval = setInterval(() => {
    setDots(".".repeat((count % 3) + 1));
    count++;
  }, 500);
  return interval;
};
