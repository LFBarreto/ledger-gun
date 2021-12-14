import Gun from "gun";
import "gun/sea";
import "gun/axe";
import { useCallback, useEffect } from "react";

let gun: any;
let user: any;

const useGun = () => {
  useEffect(() => {
    gun = Gun([
      "http://localhost:3000/gun",
      "https://ledger-gun.vercel.app/gun",
      "https://gun-hackathon-test.herokuapp.com/gun",
    ]);
    user = gun.user().recall({ sessionStorage: true });
    gun.on("auth", (...args: any) => console.log("on auth", ...args));
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

  const createUser = useCallback(
    (username, password) => {
      return new Promise((resolve, reject) => {
        if (!gun) reject(false);
        user
          .create(username, password, ({ err }: any) => {
            if (err) {
              reject(false);
            } else {
              login(username, password).then(resolve, reject);
            }
          })
          .on((ack: any) => {
            const infos = { createdAt: Date.now() };
            user.get("profile").set(infos);
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
    gun,
    isLogged,
  };
};

export default useGun;
