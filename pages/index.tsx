import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import type { Account } from "@ledgerhq/live-app-sdk";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useApi } from "../src/providers/LedgerLiveSDKProvider";
import { Flex, Text } from "@ledgerhq/react-ui";
import AnimatedLogo from "../src/components/AnimatedLogo";
import { useTranslation } from "next-i18next";
import useGun from "../src/hooks/useGun";
import Button from "../src/components/Button";
import Input from "../src/components/Input";

const DebugApp = (): React.ReactElement => {
  const { t } = useTranslation();
  const api = useApi();
  const { createUser } = useGun();
  const [accounts, setAccounts] = useState<any>([]);
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [error, setError] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const initAccounts = async () => {
      setReady(true);
      const availableAccounts = await api?.listAccounts();

      setAccounts(availableAccounts);
    };

    initAccounts();
  }, [setAccounts]);

  const login = useCallback(async (username, password) => {
    const user = await createUser(username, password);
    if (user) router.push("/main");
    else setError(user);
  }, []);

  const handleSignMessage = async (account: Account) => {
    try {
      // @ts-expect-error error
      const res = await api._request("message.sign", {
        accountId: account.id,
        message: `${account.address}`,
      });

      if (res) {
        login(account.id, res);
      }

      // FIXME: this will be the "password", and `account.address` will be the login
      console.log({ res });
    } catch (error) {
      // FIXME: handle error (for example user canceled signature)
      console.error(error);
    }
  };

  return (
    <Flex
      flex="1"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="stretch"
    >
      <Flex flex="1" flexDirection="column">
        {ready ? (
          accounts.length ? (
            accounts.map((acc: any, index: number) => {
              return (
                <Text
                  color="primary.c100"
                  onClick={() => {
                    handleSignMessage(acc);
                  }}
                >
                  {acc.name} ~:[{index}]
                </Text>
              );
            })
          ) : (
            <>
              <Input
                placeholder="username"
                value={username}
                onChange={setUsername}
                type="text"
              />
              <Input
                placeholder="password"
                value={password}
                onChange={setPassword}
                type="password"
              />
              {!username || !password ? null : (
                <Button
                  disabled={!username || !password}
                  onClick={() => login(username, password)}
                >
                  {t("login")}
                </Button>
              )}
            </>
          )
        ) : null}
        <Text color="error.c100">{JSON.stringify(error)}</Text>
      </Flex>
      <Flex flex="1">
        <AnimatedLogo />
      </Flex>
    </Flex>
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
