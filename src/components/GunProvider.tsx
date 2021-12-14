import React, { useEffect, useContext, useCallback, useState } from "react";
import Gun from "gun";
import "gun/sea";
// @ts-expect-error
import iris from "iris-lib";
import { IGunChainReference } from "gun/types/chain";

export const GunContext = React.createContext<null | IGunChainReference>(null);

const GunProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [gun, setGunInstance] = React.useState<null | IGunChainReference>(null);

  useEffect(() => {
    const gunInstance = Gun([
      "http://localhost:8765/gun" /*"https://ledger-gun.vercel.app"*/,
    ]);

    setGunInstance(gunInstance);
  }, []);

  return <GunContext.Provider value={gun}>{children}</GunContext.Provider>;
};

const useGun = () => {
  const gun = useContext(GunContext)
  const [superUser, setSuperUser] = useState<null | { [key: string]: any }>(null)
  const user = gun.user()
  if (!gun) return null

  useEffect(() => {

    const getSuperUser = async () => {
      const usr = user.auth("master-user", "notyourpassword").on((ack: unknown) => {
        console.log("user logged in", ack)
      });
      let su = localStorage.getItem("su")
      if (!su) {
        su = await iris.Key.generate();
        localStorage.setItem('su', JSON.stringify(su));
      } else {
        su = JSON.parse(su);
      }

      setSuperUser({
        gunUser: usr,
        irisKeys: su
      })
    }
  }, []);

  // @ts-expect-error types not working correctly
  gun.on("auth", (ack: unknown) => console.log("User logged in successfully", ack))

  const getPair = useCallback(async (alias: string) => {
    let pair
    if (!pair) {
      pair = await iris.Key.generate();
      localStorage.setItem(alias, JSON.stringify(pair));
    } else {
      pair = JSON.parse(pair);
    }

    return pair
  }, [])

  const auth = useCallback(async (alias: string, password: string) => {
    user.auth(alias, password);
    const pair = await getPair(alias);
    iris.Channel.initUser(gun, pair);
  }, [user]);

  const createUser = useCallback(async (alias: string, password: string) => {
    user.create(alias, password)
    const pair = await getPair(alias);
    iris.Channel.initUser(gun, pair);
  }, [user]);

  const joinPublicChannel = useCallback(() => {
    
  }, [superUser])

  return {
    auth,
    createUser,
    createPrivateChannel: () => {}
  }
}

export default GunProvider;
