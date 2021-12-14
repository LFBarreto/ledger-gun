import React from "react";
import { map, reduce, sortBy } from "lodash";
import styled from "styled-components";

import { Room, User } from "../types";

type RoomTree<Keys extends string> = {
  [K in Keys]: Room[];
};

const SideBarBody = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.colors.primary.c100};
  font-family: monospace;
  line-height: 1.5rem;
  width: 16rem;
  border: 0.2rem solid ${(props) => props.theme.colors.primary.c100};
  padding: 1rem;
  font-size: 1.1rem;
  height: 100%;
`;

const Categories = styled.div`
  flex: 1;
`;

const Category = styled.div`
  margin-top: 2rem;
`;

const RoomList = styled.ul`
  list-style-type: none;
`;

const RoomListItem = styled.li`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-left: 1rem;

  :hover {
    background: ${(props) => props.theme.colors.primary.c100};
    color: ${(props) => props.theme.colors.background.main};
  }

  :active {
    font-weight: bold;
  }

  a {
    text-decoration: none;
  }
`;

const Button = styled.button`
  border: 0.2rem solid ${(props) => props.theme.colors.primary.c100};
  border-radius: 0;
  color: ${(props) => props.theme.colors.primary.c100};
  background: ${(props) => props.theme.colors.background.main};
  padding: 0.5rem;

  :hover {
    background: ${(props) => props.theme.colors.primary.c100};
    color: ${(props) => props.theme.colors.background.main};
  }

  :active {
    font-weight: bold;
  }
`;

const AddRoomButton = styled(Button)`
  flex: 1;
  margin-left: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

export type SideBarProps = {
  user: User;
  rooms: Room[];
  onSelect: (_: Room) => void;
  onCreate: () => void;
};

const SideBar = ({
  user,
  rooms,
  onSelect,
  onCreate,
}: SideBarProps): JSX.Element => {
  const sortedRooms = sortBy(rooms, (room) => room.name);

  const emptyRoomTree: RoomTree<"public" | "private"> = {
    public: [],
    private: [],
  };

  const roomsByCategories = reduce(
    sortedRooms,
    (acc, room) => {
      if (room.private) {
        return {
          ...acc,
          private: acc.private.concat([room]),
        };
      }
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
        <Button>{"<<"}</Button>
        <AddRoomButton onClick={onCreate}>New Room</AddRoomButton>
      </div>
      <Categories>
        {map(roomsByCategories, (rooms, category) => (
          <Category key={category}>
            <strong>{`> ${category}`}</strong>
            <RoomList>
              {rooms.map((room) => (
                <RoomListItem key={room.id}>
                  <a href="#" onClick={() => onSelect(room)}>
                    {room.name}
                  </a>
                </RoomListItem>
              ))}
            </RoomList>
          </Category>
        ))}
      </Categories>
      <Footer>
        <span>{user.alias}</span>
      </Footer>
    </SideBarBody>
  );
};

export default SideBar;
