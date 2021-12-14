import React from "react";
import Layout from "../src/components/Layout";

import mock from "../src/types/mock";

export default function Main(): React.ReactElement {
  const user = mock.Users[0];
  const rooms = mock.Rooms;

  return (
    <Layout user={user as any} rooms={rooms}>
      <div />
    </Layout>
  );
}
