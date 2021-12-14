import React, { createContext, useRef, useEffect, useContext } from "react";
import LedgerLiveApi, { WindowMessageTransport } from "@ledgerhq/live-app-sdk";

type LedgerLiveSDKContextType = {
  api?: LedgerLiveApi;
};

const defaultContext: LedgerLiveSDKContextType = { api: undefined };

export const LedgerLiveSDKContext =
  createContext<LedgerLiveSDKContextType>(defaultContext);

const LedgerLiveSDKProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const api = useRef<LedgerLiveApi | null>(null);

  useEffect(() => {
    const llapi = new LedgerLiveApi(new WindowMessageTransport());

    api.current = llapi;

    llapi.connect();

    return () => {
      api.current = null;
      void llapi.disconnect();
    };
  }, []);

  if (!api.current) {
    return <></>;
  }

  return (
    <LedgerLiveSDKContext.Provider value={{ api: api.current }}>
      {children}
    </LedgerLiveSDKContext.Provider>
  );
};

export const useApi = () => {
  const { api } = useContext(LedgerLiveSDKContext);

  // This should never theoretically never happen
  if (!api) {
    // throw new Error("API not initialized");
    console.log("API not initialized");
  }

  return api;
};

export default LedgerLiveSDKProvider;
