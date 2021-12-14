import React, { useEffect } from "react";
import Gun from "gun/gun";
import { IGunChainReference } from "gun/types/chain"; 

export const GunContext = React.createContext<null | IGunChainReference>(null);

const GunProvider = ({ children }: { children: React.ReactNode }) => {
  const [gun, setGunInstance] = React.useState<null | IGunChainReference>(null);

  useEffect(() => {
    const gunInstance = Gun(["https://gun-us.herokuapp.com/gun"]);
    setGunInstance(gunInstance);
  }, []);

  return <GunContext.Provider value={gun}>{children}</GunContext.Provider>;
};

export default GunProvider;
