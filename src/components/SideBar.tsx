import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { map, noop, reduce, sortBy } from "lodash";

import Button, { BaseButton } from "./Button";
import Box from "./Box";
import Text from "./Text";
import { User } from "../types";
import useGun from "../hooks/useGun";
import ChannelForm from "./ChannelForm";
import UserProfileManager from "./UserProfileManager";

type RoomTree<Keys extends string> = {
  [K in Keys]: string[];
};

const Container = styled(Box).attrs({ withBorder: true })`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  font-family: monospace;
  line-height: 1.5rem;
  font-size: 1.1rem;
`;

const Header = styled(Box).attrs({ withPadding: true })`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 2px solid ${(props) => props.theme.colors.primary.c100};
`;

const SideBarBody = styled(Box).attrs({ withPadding: true })`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.colors.primary.c100};
  padding: ${(props) => props.theme.space[7]}px;
  width: 100%;
  overflow: scroll;
`;

const Footer = styled(Box).attrs({ withPadding: true })`
  border-top: 2px solid ${(props) => props.theme.colors.primary.c100};
  display: flex;
  justify-content: space-evenly;
`;

const Categories = styled.div`
  flex: 1;
`;

const Category = styled.div`
  margin-top: ${(props) => props.theme.space[7]}px;
`;

const RoomList = styled.ul`
  list-style-type: none;
`;

const RoomListItem = styled.li`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-left: ${(props) => props.theme.space[7]}px;

  :hover {
    background: ${(props) => props.theme.colors.primary.c100};
    color: ${(props) => props.theme.colors.background.main};
  }

  :active {
    font-weight: bold;
    background: ${(props) => props.theme.colors.primary.c100};
    color: ${(props) => props.theme.colors.background.main};
  }

  a {
    text-decoration: none;
  }
`;

const AddRoomButton = styled(Button)`
  flex: 1;
  margin-left: ${(props) => props.theme.space[7]}px;
`;

const Username = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 1rem;
  text-align: center;
`;

export type SideBarProps = {
  user: User;
  rooms: string[];
  onClose: () => void;
  onSelect: (_: string) => void;
  onCreate: (_: string) => void;
};

const SideBar = ({
  user,
  rooms,
  onClose,
  onSelect,
  onCreate,
}: SideBarProps): JSX.Element => {
  const { logout } = useGun();
  const [isChannelFormOpen, setChannelFormOpen] = useState(false);

  const handleCreate = (value: string) => {
    onCreate(value);
    setChannelFormOpen(false);
  };

  const [showUserProfile, setShowUserProfile] = useState(false);
  const sortedRooms = sortBy(rooms, (room) => room);

  const toggleShowUserProfile = useCallback(() => {
    setShowUserProfile(!showUserProfile);
  }, [showUserProfile, setShowUserProfile]);

  const emptyRoomTree: RoomTree<"public" | "private"> = {
    public: [],
    private: [],
  };

  const roomsByCategories = reduce(
    sortedRooms,
    (acc, room) => {
      /**
        if (room.private) {
          return {
            ...acc,
            private: acc.private.concat([room]),
          };
        }
      */
      return {
        ...acc,
        public: acc.public.concat([room]),
      };
    },
    emptyRoomTree
  );

  const onAliasChange = noop; // TODO:
  const onFollowedChange = noop; // TODO:
  const onBlackListChange = noop; // TODO:

  return (
    <Container>
      <Header>
        <Button
          onClick={showUserProfile ? toggleShowUserProfile : onClose}
          style={{
            whiteSpace: "pre",
            alignSelf: "flex-start",
          }}
        >
          {showUserProfile ? "⤫" : "<<"}
        </Button>
        <Text style={{ flex: 1, textAlign: "center" }}>
          {showUserProfile ? "PROFILE" : "ROOMS"}
        </Text>
      </Header>
      <SideBarBody>
        {showUserProfile ? (
          <UserProfileManager
            user={user}
            onAliasChange={onAliasChange}
            onFollowedChange={onFollowedChange}
            onBlackListChange={onBlackListChange}
          />
        ) : isChannelFormOpen ? (
          <ChannelForm
            onSubmit={handleCreate}
            onClose={() => setChannelFormOpen(false)}
          />
        ) : (
          <>
            <AddRoomButton onClick={() => setChannelFormOpen(true)}>
              New Room
            </AddRoomButton>
            <Categories>
              {map(roomsByCategories, (rooms, category) => (
                <Category key={category}>
                  <strong>{`> ${category}`}</strong>
                  <RoomList>
                    {rooms.map((room) => (
                      <RoomListItem key={room}>
                        <div onClick={() => onSelect(room)}>{room}</div>
                      </RoomListItem>
                    ))}
                  </RoomList>
                </Category>
              ))}
            </Categories>
          </>
        )}
      </SideBarBody>
      <Footer>
        <BaseButton onClick={toggleShowUserProfile}>[{user?.alias}]</BaseButton>
        <BaseButton onClick={logout}>[logout]</BaseButton>
      </Footer>
    </Container>
  );
};

export default SideBar;
