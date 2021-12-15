import React, { useState } from "react";
import styled from "styled-components";
import { Flex } from "@ledgerhq/react-ui";
import Text from "./Text";
import Box from "./Box";
import { BaseButton } from "./Button";
import { UserID } from "../types";
import { noop } from "lodash";

type Props = {
  title: string;
  users: UserID[];
  hasButton?: boolean;
  buttonLabel?: string;
  onClickButton?: (userId: UserID) => any;
};

const Username = styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Container = styled(Box).attrs({ withPadding: true, withBorder: true })`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export default function UserList({
  users,
  title,
  hasButton,
  buttonLabel,
  onClickButton,
}: Props) {
  const [opened, setOpened] = useState(false);

  // TODO: get matching alias for each userId

  return (
    <Container style={{ rowGap: 15 }}>
      <Text bold onClick={() => setOpened(!opened)}>
        <Text>{opened ? "⌄" : ">"}</Text> {title} ({users.length})
      </Text>
      {opened
        ? users.map((userId) => (
            <Flex
              key={`user-${userId}`}
              flexDirection="row"
              alignSelf="stretch"
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Username>.. {userId}</Username>
              {hasButton && (
                <BaseButton
                  onClick={onClickButton ? () => onClickButton(userId) : noop}
                  style={{ flexShrink: 0, marginLeft: "15px" }}
                >
                  [{buttonLabel || "remove"}]
                </BaseButton>
              )}
            </Flex>
          ))
        : null}
    </Container>
  );
}
