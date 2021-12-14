import React, { useCallback, useEffect, useRef, useState } from "react";
import LedgerLiveApi, {
  WindowMessageTransport,
  deserializeTransaction,
} from "@ledgerhq/live-app-sdk";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@ledgerhq/react-ui";

const DebugApp = (): React.ReactElement => {
  const api = useRef<LedgerLiveApi | null>(null);
  const [, setLastAnswer] = useState<any>(undefined);
  const [, setAnswerType] = useState<string>("none");
  const [accounts, setAccounts] = useState<any>([]);
  const [account, setAccount] = useState<any>(null);

  const execute = useCallback(
    async (method, payload) => {
      if (!api.current) {
        return;
      }

      let action;
      switch (method) {
        case "account.list":
          action = api.current.listAccounts();
          break;
        case "account.request":
          try {
            action = api.current.requestAccount(payload);
          } catch (error) {
            action = Promise.reject(error);
          }
          break;
        case "account.receive":
          if (account) {
            action = api.current.receive(account.id);
          } else {
            action = Promise.reject(new Error("No accountId selected"));
          }
          break;
        case "transaction.sign":
          try {
            const transaction = deserializeTransaction(payload.transaction);
            action = api.current.signTransaction(
              account.id,
              transaction,
              payload?.params
            );
          } catch (error) {
            action = Promise.reject(error);
          }
          break;
        case "message.sign":
          try {
            // @ts-expect-error to update
            action = api.current._request("message.sign", {
              accountId: payload.accountId,
              message: payload.message,
              params: payload?.params || {},
            });
          } catch (error) {
            action = Promise.reject(error);
          }
          break;
        case "transaction.broadcast":
          try {
            const rawSignedTransaction = payload;
            action = api.current.broadcastSignedTransaction(
              account.id,
              rawSignedTransaction
            );
          } catch (error) {
            action = Promise.reject(error);
          }
          break;
        case "currency.list":
          try {
            action = api.current.listCurrencies(payload);
          } catch (error) {
            action = Promise.reject(error);
          }
          break;
        default:
          action = Promise.resolve();
      }

      try {
        setAnswerType("pending");
        setLastAnswer("Waiting...");
        const result = await action;
        setAnswerType("success");
        setLastAnswer(result);
        if (method === "account.list") {
          setAccounts(result);
        }
      } catch (err: any) {
        setLastAnswer({ message: err.message });
        console.error(err);
        setAnswerType("error");
      }
    },
    [account]
  );

  useEffect(() => {
    const llapi = new LedgerLiveApi(new WindowMessageTransport());
    api.current = llapi;

    llapi.connect();
    execute("account.list", undefined);
    return () => {
      api.current = null;
      void llapi.disconnect();
    };
  }, []);

  return (
    <div>
      {accounts &&
        accounts.map((acc: any) => {
          return (
            <div>
              <Button
                onClick={() => {
                  setAccount(acc);
                  execute("message.sign", {
                    accountId: acc.id,
                    message: `${acc.address}`,
                  });
                }}
              >
                {acc.name}
              </Button>
            </div>
          );
        })}
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
