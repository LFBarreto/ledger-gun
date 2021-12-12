import React, { useCallback, useEffect, useRef, useState } from "react";
import LedgerLiveApi, {
  WindowMessageTransport,
  deserializeTransaction,
} from "@ledgerhq/live-app-sdk";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@ledgerhq/react-ui";
/**
const PAYLOAD_BROADCAST = {
  accountId: "ACCOUNT_ID",
  signedTransaction: {
    operation: {},
    signature: "SIGNATURE",
    expirationDate: null,
  },
};


const ACTIONS = [
  { value: "account.list", label: "List Accounts" },
  { value: "account.request", label: "Request Account", usePayload: true },
  { value: "account.receive", label: "Verify Address", useAccount: true },
  {
    value: "transaction.sign",
    label: "Sign Transaction",
    useAccount: true,
    usePayload: true,
  },
  {
    value: "message.sign",
    label: "Sign Message",
    useAccount: true,
    usePayload: true,
  },
  {
    value: "transaction.broadcast",
    label: "Broadcast Transaction",
    useAccount: true,
    usePayload: PAYLOAD_BROADCAST,
  },
  { value: "currency.list", label: "List Currencies", usePayload: true },
];

const prettyJSON = (payload: any) => JSON.stringify(payload, null, 2);
*/
const DebugApp = () => {
  const api = useRef<LedgerLiveApi | null>(null);
  const { t } = useTranslation("common");
  const [, setLastAnswer] = useState<any>(undefined);
  const [, setAnswerType] = useState<string>("none");
  const [, setAccounts] = useState<any>([]);
  const [account, setAccount] = useState<any>(null);

  const execute = useCallback(
    async (method, rawPayload) => {
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
            const payload = rawPayload ? JSON.parse(rawPayload) : undefined;
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
            const payload = JSON.parse(rawPayload);
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
            const payload = JSON.parse(rawPayload);
            // @ts-expect-error to update
            action = api.current._request("message.sign", {
              accountId: account.id,
              message: payload.message,
              params: payload?.params || {},
            });
          } catch (error) {
            action = Promise.reject(error);
          }
          break;
        case "transaction.broadcast":
          try {
            const rawSignedTransaction = JSON.parse(rawPayload);
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
            const payload = rawPayload ? JSON.parse(rawPayload) : undefined;
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
        if (method.value === "account.list") {
          setAccounts(result);
          if (result instanceof Array && result.length) {
            setAccount(result[0]);
          }
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

  return <Button variant="main">{t("hello")}</Button>;
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default DebugApp;
