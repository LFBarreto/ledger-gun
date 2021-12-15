import Gun from "gun";
import "gun/sea";
import "gun/axe";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

let gun: any;
let user: any;

const useGun = (): {
  createUser: (username: string, password: string) => Promise<unknown>;
  login: (username: string, password: string) => Promise<unknown>;
  logout: () => void;
  gun: any;
  user: any;
  profile: any;
  isLogged: () => boolean;
} => {
  const [profile, setProfile] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    gun = Gun([
      "http://localhost:3000/gun",
      "https://ledger-gun.vercel.app/gun",
      "https://gun-hackathon-test.herokuapp.com/gun",
    ]);
    user = gun.user().recall({ sessionStorage: true });
    gun.on("auth", async () => {
      const pro = await user; // username string
      setProfile(pro);
    });
    return () => gun.off();
  }, []);

  const login = useCallback(
    (login, password) => {
      return new Promise((resolve, reject) => {
        if (!gun) reject(false);
        user.auth(login, password, ({ err, id }: any) => {
          if (err) reject(err);
          else resolve(id);
        });
      });
    },
    [gun]
  );

  const isLogged = useCallback(() => user.is, [user]);

  const logout = useCallback(() => {
    setProfile(null);
    user.leave();
    router.push("/");
  }, []);

  const createUser = useCallback(
    (username, password) => {
      return new Promise((resolve, reject) => {
        if (!gun) reject(false);
        user
          .create(username, password, ({ err }: any) => {
            if (err) {
              return login(username, password).then(resolve, reject);
            } else {
              reject(false);
            }
          })
          .on((ack: any) => {
            const infos = { createdAt: Date.now() };
            user.set(infos);
            // const pair = SEA.pair((keys) => console.log("SEA keys", keys));
            resolve(ack);
          });
      });
    },
    [gun]
  );

  return {
    createUser,
    login,
    logout,
    gun,
    user,
    profile,
    isLogged,
  };
};

export default useGun;
