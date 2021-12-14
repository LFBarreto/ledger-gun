import React from "react";
import dynamic from "next/dynamic";

import mock from "../src/types/mock";

const Layout = dynamic(() => import("../src/components/Layout"), {
  ssr: false,
});

export default function Main(): React.ReactElement {
  const user = mock.Users[0];
  const rooms = mock.Rooms;

  return (
    <Layout user={user as any} rooms={rooms}>
      <div />
    </Layout>
  );
}
