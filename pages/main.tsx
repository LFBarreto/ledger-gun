import React from "react";
import dynamic from "next/dynamic";

import ChatWindow from "../src/components/ChatWindow";
import mock from "../src/types/mock";

const Layout = dynamic(() => import("../src/components/Layout"), {
  ssr: false,
});

export default function Main(): React.ReactElement {
  const user = mock.Users[0];
  const rooms = mock.Rooms;
  const messages = mock.Channels[1].messages;

  return (
    <Layout user={user as any} rooms={rooms}>
      <ChatWindow userID={user.alias} messages={messages} />
    </Layout>
  );
}
