import React from "react";
import dynamic from "next/dynamic";

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

  return (
    <Layout user={user as any} rooms={rooms}>
      <div />
    </Layout>
  );
}
