import React from "react";

import SideBar from "../src/components/SideBar";
import mock from "../src/types/mock";

export default function Main(): React.ReactElement {
  const user = mock.Users[0];
  const rooms = mock.Rooms;

  return (
    <div>
      <SideBar
        user={user as any}
        rooms={rooms}
        onSelect={() => null}
        onCreate={() => null}
      />
    </div>
  );
}
