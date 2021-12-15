import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ChatWindow from "../src/components/ChatWindow";
import useGun from "../src/hooks/useGun";
import { useApi } from "../src/providers/LedgerLiveSDKProvider";
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
  const { isLogged, profile, channel, messages, sendMessage, updateMessages } =
    useGun();

  const api = useApi();

  useEffect(() => {
    if (!isLogged()) router.push("/");
  }, []);

  return (
    <Layout user={profile}>
      {channel ? (
        <ChatWindow
          userID={profile?.alias}
          messages={messages}
          onSubmitCommand={(command) => {
            console.log("command submitted", command);
            switch (command) {
              case "/send":
                sendMessage(
                  "Hello, you can send me your wallet address to send me your sweet sweet money?: "
                );
                break;
              case "/request":
                if (profile) {
                  api?.receive(profile.alias).then((accoundAddress: string) => {
                    sendMessage(
                      "Hello, you can send me your sweet sweet money in the following address: " +
                        accoundAddress
                    );
                  });
                } else {
                  console.error(new Error("No accountId selected"));
                }
                break;
              case "/giphy":
                sendMessage(
                  "Hello, you can send me your wallet address to send me your sweet sweet money?: "
                );
                break;
            }
          }}
          onSubmitMessage={(message: string) => sendMessage(message)}
        >
          <RefreshButton Icon={Icons.RefreshRegular} onClick={updateMessages} />
        </ChatWindow>
      ) : null}
    </Layout>
  );
}
