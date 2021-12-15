import React from "react";
import { PublicUser, UserID } from "../types";
import { Flex } from "@ledgerhq/react-ui";
import KeyValueText from "./KeyValueText";
import QRCode from "./QRCode";
import UserList from "./UserList";

import { Container } from "./UserProfileManager";

type Props = {
  user: PublicUser;
  onAliasChange: (alias: string) => void;
  onFollowedChange: (followers: UserID[]) => void;
  onBlackListChange: (blackList: UserID[]) => void;
};

const PublicUserProfile = ({ user }: Props) => {
  const { id, alias, currency, address, followed, followers } = user;
  return (
    <Container>
      <KeyValueText k="Username" value={alias} />
      <KeyValueText k="id" value={id} />
      <KeyValueText k="currency" value={currency} />
      <KeyValueText k="address" value={address} />
      <Flex alignSelf="center">
        {/* TODO: figure out exactly what to put in QR Code: dumb plain address or smart URI ? */}
        <QRCode data={id} />
      </Flex>
      <UserList users={followed} title="Followed" />
      <UserList users={followers} title="Followers" />
    </Container>
  );
};

export default PublicUserProfile;
