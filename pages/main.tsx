import React from "react";
import dynamic from "next/dynamic";

import ChatWindow from "../src/components/ChatWindow";
import mock from "../src/types/mock";
import { User } from "../src/types";

const Layout = dynamic(() => import("../src/components/Layout"), {
  ssr: false,
});

export default function Main({
  user = mock.Users[0],
}: {
  user: User;
}): React.ReactElement {
  const rooms = mock.Rooms;
  const messages = mock.Channels[1].messages;

  return (
    <Layout user={user as any} rooms={rooms}>
      <ChatWindow userID={user.alias} messages={messages as any} />
    </Layout>
  );
}
