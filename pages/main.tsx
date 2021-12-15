import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ChatWindow from "../src/components/ChatWindow";
import useGun from "../src/hooks/useGun";
import { Icons } from "@ledgerhq/react-ui";
import styled from "styled-components";
import { Button } from "@ledgerhq/react-ui";

const RefreshButton = styled(Button)`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
`;

const Layout = dynamic(() => import("../src/components/Layout"), {
  ssr: false,
});

export default function Main(): React.ReactElement {
  const router = useRouter();
  const {
    isLogged,
    profile,
    channel,
    channels,
    messages,
    sendMessage,
    updateMessages,
  } = useGun();

  useEffect(() => {
    if (!isLogged()) router.push("/");
  }, []);

  return (
    <Layout user={profile} rooms={channels}>
      {channel ? (
        <ChatWindow
          userID={profile?.alias}
          messages={messages}
          onSubmitMessage={(message: string) => sendMessage(message)}
        >
          <RefreshButton Icon={Icons.RefreshRegular} onClick={updateMessages} />
        </ChatWindow>
      ) : null}
    </Layout>
  );
}
