import React from "react";
import styled from "@ledgerhq/react-ui/components/styled";
import { Flex } from "@ledgerhq/react-ui";
import { UserID, Message } from "../types";

const TextHolder = styled.div.attrs<{ textAlign: string }>({
  color: "primary.c100",
  flex: 1,
})<{ textAlign: string }>`
  text-align: ${(p) => p.textAlign};
  width: auto;
  height: 100%;
  position: relative;
  background-color: transparent;
  border: none;
  caret-color: currentColor;
  height: auto;xc
  text-decoration: none !important;
  padding-right: 5px;
  white-space: pre;
`;

export default function MessageComponent({
  userID,
  message,
  ...rest
}: Partial<{
  userID: UserID;
  message: Message;
}>): React.ReactElement {
  return (
    <Flex
      width="100%"
      position="relative"
      height="fit-content"
      my={1}
      className="message-gun"
      {...rest}
    >
      <TextHolder textAlign={userID === message?.from ? "right" : "left"}>
        {message?.message}
      </TextHolder>
    </Flex>
  );
}
