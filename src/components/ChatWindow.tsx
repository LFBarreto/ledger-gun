import React, { useCallback, useEffect, useRef, useState } from "react";
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
  ...rest
}: Partial<{
  userID: UserID;
  messages: Message[];
  onSubmitMessage?: (m: Message) => void;
  children: React.ReactNode;
}>): React.ReactElement {
  const [m, setM] = useState(messages);
  const ref = useRef<HTMLElement>();
  const handlePushMessage = useCallback(
    (mess) => {
      setM((m) =>
        m.concat([
          {
            message: mess,
            from: userID,
            id: "" + Date.now(),
            meta: { creationDate: new Date() },
            data: {},
          },
        ])
      );
      onSubmitMessage && onSubmitMessage(mess);
    },
    [userID]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (ref && ref.current && ref.current.querySelectorAll) {
        const els: HTMLElement[] = Array.from(
          ref.current.querySelectorAll("div.message-gun")
        );
        if (els.length > 0) {
          const el: HTMLElement = els[els.length - 1];
          if (el) el.scrollIntoView();
        }
      }
    }, 50);

    return () => clearTimeout(t);
  }, [messages, ref]);

  console.log(messages);
  return (
    <Flex
      flex="1"
      flexDirection="column"
      alignItems="stretch"
      position="relative"
      {...rest}
    >
      <ChatContainer ref={ref}>
        {children}
        {m.map((message, i) => (
          <MessageComponent
            key={message?.id + i}
            message={message}
            showUsername={i === 0 || m[i - 1].from !== message.from}
            isReverse={userID === message.from}
          />
        ))}
      </ChatContainer>
      <ChatInput onSubmit={handlePushMessage} />
    </Flex>
  );
}
