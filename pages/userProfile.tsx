import React from "react"; //, { useCallback, useState } from "react";
// import { Flex } from "@ledgerhq/react-ui";
// import UserProfileManager from "../src/components/UserProfileManager";
// import UserProfilePublic from "../src/components/UserProfilePublic";
// import Button from "../src/components/Button";
// import { UserID } from "../src/types";
// import mock from "../src/types/mock";

export default function UserProfile(): React.ReactElement {
  return <div />;
  // const [user, setUser] = useState(mock.Users[0]); // TODO: replace this by real useUser() hook
  // const [showPublicProfile, setShowPublicProfile] = useState(false);
  // const onAliasChange = (val: string) => {
  //   console.log("onAliasChange", val);
  //   setUser({ ...user, alias: val }); // TODO: replace this by real handler with side effects
  // };
  // const onFollowedChange = useCallback(
  //   (val: UserID[]) => {
  //     console.log("onFollowedChange", val);
  //     setUser({ ...user, followed: val }); // TODO: replace this by real handler with side effects
  //   },
  //   [user]
  // );
  // const onBlackListChange = useCallback(
  //   (val: UserID[]) => {
  //     console.log("onBlackListChange", val);
  //     setUser({ ...user, blackList: val }); // TODO: replace this by real handler with side effects
  //   },
  //   [user]
  // );

  // return (
  //   <Flex flexDirection="column" rowGap={30}>
  //     <Button
  //       style={{ alignSelf: "flex-start" }}
  //       onClick={() => {
  //         setShowPublicProfile(!showPublicProfile);
  //       }}
  //     >
  //       {showPublicProfile ? "show profile manager" : "show public"}
  //     </Button>
  //     {showPublicProfile ? (
  //       <UserProfilePublic user={user} />
  //     ) : (
  //       <UserProfileManager
  //         user={user}
  //         {...{ onAliasChange, onFollowedChange, onBlackListChange }}
  //       />
  //     )}
  //   </Flex>
  // );
}
