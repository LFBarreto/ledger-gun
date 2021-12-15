/* eslint-disable @typescript-eslint/no-empty-function */
import Gun from "gun";
import "gun/sea";
import "gun/axe";
import {
  useCallback,
  useEffect,
  useState,
  useContext,
  createContext,
} from "react";
import { useRouter } from "next/router";
// import "../libs/webrtc";

const MyContext = createContext<any>({
  profile: null,
  setProfile: () => {},
  channels: [],
  setChannels: () => {},
  chan: "",
  setChan: () => {},
  messages: {},
  setMessages: () => {},
});

export const GunProvider = ({ children }: any) => {
  const [profile, setProfile] = useState<any>();
  const [channels, setChannels] = useState([]);
  const [chan, setChan] = useState("");
  const [messages, setMessages] = useState({});

  const value = {
    profile,
    setProfile,
    channels,
    setChannels,
    chan,
    setChan,
    messages,
    setMessages,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

const gun = Gun([
  "http://localhost:3000/gun",
  "https://ledger-gun.vercel.app/gun",
  "https://gun-hackathon-test.herokuapp.com/gun",
]);
const user = gun.user().recall({ sessionStorage: true });

const useGun = (): {
  createUser: (username: string, password: string) => Promise<unknown>;
  login: (username: string, password: string) => Promise<unknown>;
  logout: () => void;
  gun: any;
  user: any;
  profile: any;
  isLogged: () => boolean;
  channel: string;
  channels: string[];
  setChannel: (chan: string) => void;
  removeChannel: (chan: string) => void;
  createChannel: (id: string) => void;
  messages: any[];
  sendMessage: (message: string) => void;
  updateMessages: () => void;
} => {
  const {
    profile,
    setProfile,
    channels,
    setChannels,
    chan,
    setChan,
    messages,
    setMessages,
  } = useContext(MyContext);

  const router = useRouter();

  useEffect(() => {
    // @ts-expect-error error
    gun.on("auth", async () => {
      const pro = await user; // username string
      setProfile(pro);
    });
    /* Webrtc Debugging Stuff */
    /* eslint-disable no-console */
    // gun.on(
    //   "hi",
    //   function (peer: RTCPeerConnection & { url: string; wire: unknown }) {
    //     console.log("hi!", peer);
    //     if (peer.url) {
    //       return;
    //     }
    //     // @ts-expect-error Bad bindings…
    //     Gun.obj.map(
    //       gun.back("opt.peers"),
    //       function (
    //         peer: RTCPeerConnection & {
    //           url: string;
    //           wire: { send: (_: string) => void; _send: (_: string) => void };
    //         }
    //       ) {
    //         if (!peer.url || !peer.wire) {
    //           return;
    //         }
    //         peer.wire._send = peer.wire.send;
    //         peer.wire.send = send;
    //         const tmp =
    //           "GOBBLE GOBBLE: Not sending any non-WebRTC messages to " +
    //           peer.url;
    //         console.log(tmp);
    //       }
    //     );
    //   }
    // );
    // function send(raw: string) {
    //   if (!raw) {
    //     return;
    //   }
    //   if (raw.indexOf("rtc") >= 0) {
    //     // @ts-expect-error …………
    //     if (!this._send) {
    //       return;
    //     }
    //     // @ts-expect-error …………
    //     return this._send(raw);
    //   }
    // }
    /* eslint-enable no-console */
    /* ---------------------- */

    gun.get("channels").on((ids: string) => {
      setChannels(
        Object.entries(ids)
          .filter(([_, value]) => value !== null)
          .map(([key]) => key)
      );
    });

    return () => gun.off();
  }, []);

  const updateMessages = useCallback(() => {
    if (chan) {
      console.log("update messages", chan);
      const m = gun.get("channels").get(chan).get("messages");
      // @ts-expect-error error
      m.map().on((msgs: any, key: any, _msg: any, ev: any) => {
        if (msgs) {
          const M = messages;
          if (!M[chan]) M[chan] = [];
          M[chan] = M[chan]
            .concat([msgs])
            .filter(
              (data: any, i: number, arr: any[]) =>
                arr.findIndex((d: any) => d.data["#"] === data.data["#"]) === i
            );
          console.log({ M, msgs });
          setMessages(M);
          ev.off();
        }
      });
    }
  }, [chan, setMessages, messages]);

  useEffect(() => {
    console.log("subscribe to", chan);
    let ev: any = null;
    if (chan) {
      const messages = gun.get("channels").get(chan).get("messages");
      // @ts-expect-error error
      messages.map().on((msgs: any, key: any, _msg: any, _ev: any) => {
        console.log({ msgs }, "subs");
        ev = _ev;
        if (msgs) {
          setMessages((m: any) => {
            if (!m[chan]) m[chan] = [];
            m[chan] = m[chan]
              .concat([msgs])
              .filter(
                (data: any, i: number, arr: any[]) =>
                  arr.findIndex((d: any) => d.data["#"] === data.data["#"]) ===
                  i
              );
            return m;
          });
        }
      });
    }

    return () => {
      ev?.off();
      console.log("unsubscribe to", chan);
    };
  }, [chan]);

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

  // @ts-expect-error error
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

  const sendMessage = useCallback(
    async (message) => {
      if (chan) {
        const id = new Date().toISOString();
        const alias = await user.get("alias");
        await gun
          .get("channels")
          .get(chan)
          .get("messages")
          .get(id)
          .put({
            id,
            from: alias,
            message,
            data: {},
            meta: { creationDate: id },
          });
        updateMessages();
      }
    },
    [chan, updateMessages]
  );

  const createChannel = useCallback((id: string) => {
    gun.get("channels").get(id).put({ id, messages: {} });
  }, []);

  const removeChannel = (id: string) => {
    setChannels((channels: Array<string>) =>
      channels.filter((channel: string) => channel !== id)
    );
  };

  return {
    createUser,
    login,
    logout,
    gun,
    user,
    profile,
    isLogged,
    channels,
    channel: chan,
    setChannel: setChan,
    removeChannel,
    createChannel,
    messages: chan ? messages?.[chan] ?? [] : [],
    updateMessages,
    sendMessage,
  };
};

export default useGun;
