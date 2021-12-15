import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ChatWindow from "../src/components/ChatWindow";
import mock from "../src/types/mock";
import useGun from "../src/hooks/useGun";

const Layout = dynamic(() => import("../src/components/Layout"), {
  ssr: false,
});

export default function Main(): React.ReactElement {
  const rooms = mock.Rooms;
  const messages = mock.Messages;
  const router = useRouter();
  const { isLogged, profile } = useGun();

  useEffect(() => {
    if (!isLogged()) router.push("/");
  }, []);

  return (
    <Layout user={profile} rooms={rooms}>
      <ChatWindow userID={profile?.alias} messages={messages as any} />
    </Layout>
  );
}
