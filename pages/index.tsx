import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import type { Account } from "@ledgerhq/live-app-sdk";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useApi } from "../src/providers/LedgerLiveSDKProvider";
import { Text } from "@ledgerhq/react-ui";
import AnimatedLogo from "../src/components/AnimatedLogo";
import ChatWindow from "../src/components/ChatWindow";
// import { useTranslation } from "next-i18next";
import useGun from "../src/hooks/useGun";

const DebugApp = (): React.ReactElement => {
  // const { t } = useTranslation();
  const api = useApi();
  const { createUser } = useGun();
  const [accounts, setAccounts] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const initAccounts = async () => {
      const availableAccounts = await api?.listAccounts();
      console.log(availableAccounts);
      setAccounts(availableAccounts);
    };

    initAccounts();
  }, [setAccounts]);

  const handleSignMessage = async (account: Account) => {
    try {
      // @ts-expect-error error
      const res = await api._request("message.sign", {
        accountId: account.id,
        message: `${account.address}`,
      });

      if (res) {
        const user = await createUser(account.id, res);
        if (user) router.push("/main");
      }

      // FIXME: this will be the "password", and `account.address` will be the login
      console.log({ res });
    } catch (error) {
      // FIXME: handle error (for example user canceled signature)
      console.error(error);
    }
  };

  const handleMessage = useCallback(
    (message) => {
      const index = +message.trim();
      if (!isNaN(index)) {
        if (accounts[index]) handleSignMessage(accounts[index]);
      }
    },
    [handleSignMessage, accounts]
  );

  return (
    <ChatWindow onSubmitMessage={handleMessage}>
      <AnimatedLogo
        choices={accounts.map((acc: any, index: number) => {
          return () => (
            <Text
              color="primary.c100"
              onClick={() => {
                handleSignMessage(acc);
              }}
            >
              {acc.name} ~:[{index}]
            </Text>
          );
        })}
      />
    </ChatWindow>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default DebugApp;
