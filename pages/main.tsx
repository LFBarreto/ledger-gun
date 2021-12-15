import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ChatWindow from "../src/components/ChatWindow";
import useGun from "../src/hooks/useGun";

const Layout = dynamic(() => import("../src/components/Layout"), {
  ssr: false,
});

export default function Main(): React.ReactElement {
  const router = useRouter();
  const { isLogged, profile, channel, channels, messages, sendMessage } =
    useGun();

  useEffect(() => {
    if (!isLogged()) router.push("/");
  }, []);

  return (
    <Layout user={profile} rooms={channels} currentChannel={channel}>
      {channel ? (
        <ChatWindow
          userID={profile?.alias}
          messages={messages}
          onSubmitMessage={(message: string) => sendMessage(message)}
        />
      ) : null}
    </Layout>
  );
}
