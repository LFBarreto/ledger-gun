import React, { useCallback, useEffect, useRef } from "react";
import styled from "@ledgerhq/react-ui/components/styled";
import { Flex } from "@ledgerhq/react-ui";
import { UserID, Message } from "../types";
import ChatInput from "./ChatInput";
import MessageComponent from "./Message";

const ChatContainer = styled.div.attrs<{ ref: any }>({
  flex: 1,
  flexDirection: "column",
  pr: "1em",
  justifyContent: "flex-end",
  overflowY: "scroll",
})<{ ref: any }>`
  scroll-behavior: smooth;
`;

export default function ChatWindow({
  userID = "",
  messages = [],
  onSubmitMessage,
  children,
  onSubmitCommand,
  ...rest
}: Partial<{
  userID: UserID;
  messages: Message[];
  onSubmitMessage?: (m: string) => void;
  children: React.ReactNode;
  onSubmitCommand?: (command: string) => void;
}>): React.ReactElement {
  const ref = useRef<HTMLElement>();
  const handlePushMessage = useCallback(
    (mess?: string) => {
      console.log("push message", mess);
      if (!mess) return;
      if (mess.startsWith("/") && onSubmitCommand) {
        console.log("submitting command", mess);
        onSubmitCommand(mess.trim());
        return;
      }

      onSubmitMessage && onSubmitMessage(mess);
    },
    [userID]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (ref && ref.current && ref.current.querySelectorAll) {
        const els: HTMLElement[] = Array.from(ref.current.querySelectorAll("div.message-gun"));
        if (els.length > 0) {
          const el: HTMLElement = els[els.length - 1];
          if (el) el.scrollIntoView();
        }
      }
    }, 50);

    return () => clearTimeout(t);
  }, [messages, ref]);

  return (
    <Flex flex="1" flexDirection="column" alignItems="stretch" position="relative" {...rest}>
      <ChatContainer ref={ref}>
        {children}
        {messages.map((message, i) => (
          <MessageComponent
            key={message?.id + i}
            message={message}
            showUsername={i === 0 || messages[i - 1].from !== message.from}
            isReverse={userID === message.from}
          />
        ))}
      </ChatContainer>
      <ChatInput onSubmit={handlePushMessage} />
    </Flex>
  );
}
