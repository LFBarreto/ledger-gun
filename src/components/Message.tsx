import { Flex } from "@ledgerhq/react-ui";
import React from "react";
import styled from "styled-components";
import Linkify from "linkify-react";

import { Message } from "../types";

const linkifyOptions = { defaultProtocol: "https", target: "_blank" };

const TextBody = styled.div<{ isReverse: boolean }>`
  color: ${(props) => props.theme.colors.primary.c100};
  font-family: monospace;
  font-size: 0.9rem;
  border-${(props) => (props.isReverse ? "right" : "left")}: 2px solid ${(
  props
) => props.theme.colors.primary.c100};
  padding: ${(props) => props.theme.space[4]}px;
  margin-bottom: 2px;
  white-space: pre-line;
`;

const UsernameText = styled(Flex)`
  font-size: 0.9rem;
  font-weight: 600;
`;

const DateText = styled(Flex)`
  font-size: 0.7rem;
  font-weight: 400;
`;

const MessageBox = ({
  message,
  isReverse = false,
  showUsername = true,
}: {
  message: Message;
  isReverse: boolean;
  showUsername: boolean;
}): JSX.Element => {
  console.log({ message });
  return (
    <Flex mb={4} flexDirection={isReverse ? "row-reverse" : "row"}>
      <Flex ml={2} flexDirection={"column"}>
        {showUsername && (
          <UsernameText
            color={"primary.c80"}
            flexDirection={isReverse ? "row-reverse" : "row"}
            mb={2}
          >
            {message.from}
          </UsernameText>
        )}
        <TextBody isReverse={isReverse}>
          <Linkify options={linkifyOptions}>{message.message}</Linkify>
        </TextBody>
        <DateText
          color={"primary.c100"}
          flexDirection={isReverse ? "row-reverse" : "row"}
        >
          {message?.meta?.creationDate}
        </DateText>
      </Flex>
    </Flex>
  );
};

export default MessageBox;
