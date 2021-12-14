import React, { useEffect } from "react";
import Gun from "gun";
import { IGunChainReference } from "gun/types/chain";

export const GunContext = React.createContext<null | IGunChainReference>(null);

const GunProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [gun, setGunInstance] = React.useState<null | IGunChainReference>(null);

  useEffect(() => {
    const gunInstance = Gun(["https://ledger-gun.vercel.app"]);
    setGunInstance(gunInstance);
  }, []);

  return <GunContext.Provider value={gun}>{children}</GunContext.Provider>;
};

export default GunProvider;
