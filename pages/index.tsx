import React, { useEffect, useState } from "react";
import type { Account } from "@ledgerhq/live-app-sdk";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@ledgerhq/react-ui";
import { useApi } from "../src/providers/LedgerLiveSDKProvider";

const DebugApp = (): React.ReactElement => {
  const api = useApi();
  const [accounts, setAccounts] = useState<any>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    const initAccounts = async () => {
      const availableAccounts = await api.listAccounts();
      setAccounts(availableAccounts);
    };

    initAccounts();
  }, []);

  const handleSignMessage = async (account: Account) => {
    try {
      const res = await api.signMessage({
        accountId: account.id,
        message: `${account.address}`,
      });

      // FIXME: this will be the "password", and `account.address` will be the login
      console.log({ res });
    } catch (error) {
      // FIXME: handle error (for example user canceled signature)
      console.error(error);
    }
  };

  return (
    <div>
      <div>Selected account: {selectedAccount?.name || "N/A"}</div>
      <select
        onChange={(event) => {
          const account = accounts.find(
            (account: any) => account.id === event.target.value
          );
          setSelectedAccount(account);
        }}
      >
        {accounts &&
          accounts.map((acc: any) => {
            return (
              <option key={acc.address} value={acc.id}>
                {acc.name}
              </option>
            );
          })}
      </select>
      <Button
        disabled={!selectedAccount}
        onClick={() => {
          if (!selectedAccount) {
            return;
          }

          handleSignMessage(selectedAccount);
        }}
      >
        Sign in
      </Button>
    </div>
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
