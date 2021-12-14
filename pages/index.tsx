import React, { useEffect, useRef, useState } from "react";
import LedgerLiveApi, { WindowMessageTransport } from "@ledgerhq/live-app-sdk";
import type { Account } from "@ledgerhq/live-app-sdk";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@ledgerhq/react-ui";

const DebugApp = (): React.ReactElement => {
  const api = useRef<LedgerLiveApi | null>(null);
  const [accounts, setAccounts] = useState<any>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    const llapi = new LedgerLiveApi(new WindowMessageTransport());
    api.current = llapi;

    llapi.connect();

    const initAccounts = async () => {
      const availableAccounts = await llapi.listAccounts();
      setAccounts(availableAccounts);
    };

    initAccounts();

    return () => {
      api.current = null;
      void llapi.disconnect();
    };
  }, []);

  const handleSignMessage = async (account: Account) => {
    if (!api.current) {
      return;
    }

    try {
      const res = await api.current.signMessage({
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
      <div>
        {accounts &&
          accounts.map((acc: any) => {
            return (
              <div>
                <Button
                  onClick={() => {
                    setSelectedAccount(acc);
                    handleSignMessage(acc);
                  }}
                >
                  {acc.name}
                </Button>
              </div>
            );
          })}
      </div>
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
