import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ChatWindow from "../src/components/ChatWindow";
import useGun from "../src/hooks/useGun";
import { useApi } from "../src/providers/LedgerLiveSDKProvider";

const Layout = dynamic(() => import("../src/components/Layout"), {
  ssr: false,
});

export default function Main(): React.ReactElement {
  const router = useRouter();
  const {
    isLogged,
    profile,
    user,
    channel,
    messages,
    sendMessage,
    useUpdateChannels,
    useUpdateMessages,
  } = useGun();

  const api = useApi();
  useUpdateChannels();
  useUpdateMessages(channel);

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
            switch (command) {
              case "/send":
                sendMessage(
                  "Hello, you can send me your wallet address to send me your sweet sweet money?: "
                );
                break;
              case "/request":
                if (user) {
                  api
                    ?.receive(user.is?.alias)
                    .then((accoundAddress: string) => {
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
        ></ChatWindow>
      ) : null}
    </Layout>
  );
}
