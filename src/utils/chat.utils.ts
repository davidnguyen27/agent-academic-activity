export const scrollToBottom = (ref?: React.RefObject<HTMLDivElement | null>) => {
  if (ref?.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};

export const createTypingDotsEffect = (setDots: (dots: string) => void) => {
  let dotCount = 0;

  return setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    setDots(".".repeat(dotCount));
  }, 500);
};

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
  if (!fullText || typeof fullText !== "string") {
    updateMessages((prev) => [...prev, { role: "assistant", content: "AI not response." }]);
    doneTyping();
    return;
  }

  const characters = Array.from(fullText);
  let index = 0;

  // ✅ Hiển thị ký tự đầu tiên ngay khi bắt đầu
  updateMessages((prev) => [...prev, { role: "assistant", content: characters[0] ?? "" }]);

  const typingInterval = setInterval(() => {
    if (index >= characters.length) {
      clearInterval(typingInterval);
      doneTyping();
      return;
    }

    updateMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];

      if (!last || last.role !== "assistant") return prev;

      const nextChar = characters[index];
      if (nextChar === undefined) return prev;

      updated[updated.length - 1] = {
        ...last,
        content: last.content + nextChar,
      };

      return updated;
    });

    index++;
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, 20);
};
