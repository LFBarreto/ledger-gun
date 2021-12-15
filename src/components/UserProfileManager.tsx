import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { User, UserID } from "../types";
import { Flex } from "@ledgerhq/react-ui";
import { BaseButton } from "./Button";
import Box from "./Box";
import QRCode from "./QRCode";
import KeyValueText from "./KeyValueText";
import Text from "./Text";
import UserList from "./UserList";

type Props = {
  user: User;
  onAliasChange: (alias: string) => void;
  onFollowedChange: (followers: UserID[]) => void;
  onBlackListChange: (blackList: UserID[]) => void;
};

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const Input = styled(Text)`
  background-color: transparent;
  margin: -3px;
  padding: 3px;
  caret-color: currentColor;
  outline: 1px solid ${(props) => props.theme.colors.primary.c100};
  border: none;
  margin-right: 10px;
`;

const AliasContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

function removeId(userIds: UserID[], userId: UserID) {
  return userIds.filter((id) => id !== userId);
}

const ENTER_KEY_CODE = 13;

const UserProfileManager = ({
  user,
  onAliasChange,
  onFollowedChange,
  onBlackListChange,
}: Props) => {
  const {
    id,
    alias,
    account,
    currency,
    followed = [],
    followers = [],
    blackList = [],
  } = user;
  const [editingAlias, setEditingAlias] = useState(false);
  const [aliasEdit, setAliasEdit] = useState(alias);
  const aliasInput = useRef<HTMLInputElement>(null);

  const unfollowUser = useCallback(
    (id: UserID) => {
      onFollowedChange(removeId(followed, id));
    },
    [user]
  );

  const unblockUser = useCallback(
    (id: UserID) => {
      onBlackListChange(removeId(blackList, id));
    },
    [user]
  );

  const handleSubmit = useCallback(() => {
    onAliasChange(aliasEdit);
    aliasInput.current?.blur();
    setEditingAlias(false);
  }, [aliasInput, aliasEdit]);

  const handleAliasChange = useCallback(
    (event) => setAliasEdit(event.target.value),
    [setAliasEdit]
  );

  const handleAliasKeydown = useCallback(
    ({ keyCode }) => {
      if (keyCode == ENTER_KEY_CODE) handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <Container>
      <AliasContainer>
        <label>
          <Text bold style={{ flex: 1 }}>
            Username:{" "}
          </Text>
          {editingAlias ? (
            <Input
              autoFocus
              as="input"
              ref={aliasInput}
              type="text"
              value={aliasEdit}
              // onSubmit={handleSubmit}
              onKeyDown={handleAliasKeydown}
              onChange={handleAliasChange}
            />
          ) : (
            <Text onClick={() => setEditingAlias(true)}>{alias}</Text>
          )}
        </label>
        <BaseButton
          onClick={() =>
            editingAlias ? handleSubmit() : setEditingAlias(true)
          }
        >
          [{editingAlias ? "Save" : "Edit"}]
        </BaseButton>
      </AliasContainer>
      <KeyValueText k="id" value={id} />
      <KeyValueText k="currency" value={currency} />
      <KeyValueText k="address" value={account?.address} />
      <Flex alignSelf="center">
        {/* TODO: figure out exactly what to put in QR Code: dumb plain address or smart URI ? */}
        <QRCode data={id || "0"} />
      </Flex>
      <UserList
        hasButton
        users={followed}
        onClickButton={unfollowUser}
        title="Followed"
        buttonLabel="Unfollow"
      />
      <UserList
        hasButton
        users={blackList}
        onClickButton={unblockUser}
        title="Blocked"
        buttonLabel="Unblock"
      />
      <UserList users={followers} title="Followers" />
    </Container>
  );
};

export default UserProfileManager;
