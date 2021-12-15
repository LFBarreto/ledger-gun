import React from "react";
import styled from "styled-components";
import { map, reduce, sortBy } from "lodash";

import Button from "./Button";
import Box from "./Box";
import { User } from "../types";
import useGun from "../hooks/useGun";

type RoomTree<Keys extends string> = {
  [K in Keys]: string[];
};

const SideBarBody = styled(Box).attrs({ withPadding: true, withBorder: true })`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.colors.primary.c100};
  font-family: monospace;
  line-height: 1.5rem;
  width: 100%;
  border: 2px solid ${(props) => props.theme.colors.primary.c100};
  padding: ${(props) => props.theme.space[7]}px;
  font-size: 1.1rem;
  height: 100%;
  width: 100%;
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

const Footer = styled.div`
  display: flex;
  justify-content: center;
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
  const sortedRooms = sortBy(rooms, (room) => room);

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

  return (
    <SideBarBody>
      <div style={{ display: "flex" }}>
        <Button onClick={onClose}>{"<<"}</Button>
        <AddRoomButton onClick={() => onCreate("general")}>
          New Room
        </AddRoomButton>
      </div>
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
      <Footer>
        <span>{user?.alias}</span> - <span onClick={logout}>logout</span>
      </Footer>
    </SideBarBody>
  );
};

export default SideBar;
