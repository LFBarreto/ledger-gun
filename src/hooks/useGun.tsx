/* eslint-disable @typescript-eslint/no-empty-function */
import Gun from "gun";
import "gun/sea";
import "gun/axe";
import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  createContext,
} from "react";
import { useRouter } from "next/router";
import "../libs/webrtc";

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

  console.log("GunProvider messages", { ...messages });

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

const gun = Gun([
  "http://localhost:3000/gun",
  "https://ledger-gun.vercel.app/gun",
  "https://gun-hackathon-test.herokuapp.com/gun",
]);
const user = gun.user().recall({ sessionStorage: true });

/* Webrtc Debugging Stuff */
/* eslint-disable no-console */
gun.on(
  "hi",
  function (peer: RTCPeerConnection & { url: string; wire: unknown }) {
    console.log("hi!", peer);
    if (peer.url) {
      return;
    }
    // @ts-expect-error Bad bindings…
    Gun.obj.map(
      gun.back("opt.peers"),
      function (
        peer: RTCPeerConnection & {
          url: string;
          wire: { send: (_: string) => void; _send: (_: string) => void };
        }
      ) {
        if (!peer.url || !peer.wire) {
          return;
        }
        peer.wire._send = peer.wire.send;
        peer.wire.send = send;
        const tmp =
          "GOBBLE GOBBLE: Not sending any non-WebRTC messages to " + peer.url;
        console.log(tmp);
      }
    );
  }
);
function send(raw: string) {
  if (!raw) {
    return;
  }
  if (raw.indexOf("rtc") >= 0) {
    // @ts-expect-error …………
    if (!this._send) {
      return;
    }
    // @ts-expect-error …………
    return this._send(raw);
  }
}
/* eslint-enable no-console */
/* ---------------------- */

const useGun = (): {
  createUser: (username: string, password: string) => Promise<unknown>;
  login: (username: string, password: string, account: any) => Promise<unknown>;
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
  useUpdateChannels: () => void;
  messages: any[];
  sendMessage: (message: string) => void;
  useUpdateMessages: (chan: string) => void;
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
    if (user.is) {
      // @ts-expect-error error
      user.then(setProfile);
    }
  }, []);

  const useUpdateChannels = () => {
    useEffect(() => {
      // @ts-expect-error error
      let ev = null;
      // @ts-expect-error error
      gun.get("channels").on((ids, key, _msg, _ev) => {
        ev = _ev;
        setChannels(
          Object.keys(ids).filter((id) => id !== "_" && ids[id] !== null)
        );
      });
      // @ts-expect-error error
      return () => ev && ev.off();
    }, []);
  };

  const useUpdateMessages = (channel: string) => {
    useEffect(() => {
      if (!channel) return;
      // @ts-expect-error error
      let ev = null;
      gun
        .get("channels")
        .get(channel)
        .get("messages")
        .map()
        // @ts-expect-error error
        .once((msg: string, key, _msg, _ev) => {
          ev = _ev;
          msg &&
            setMessages(
              (mess: any) =>
                mess && {
                  [channel]: [...(mess[channel] || []), msg].filter(
                    (data: any, i: number, arr: any[]) =>
                      arr.findIndex(
                        (d: any) => d?.data["#"] === data?.data["#"]
                      ) === i
                  ),
                }
            );
        });
      // @ts-expect-error error
      return () => ev && ev.off();
    }, [channel]);
  };

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
    (username, password, account = {}) => {
      return new Promise((resolve, reject) => {
        if (!gun) reject(false);
        user
          .create(username, password, () => {
            return login(username, password).then(resolve, reject);
          })
          .on((ack: any) => {
            const infos = {
              alias: username,
              createdAt: Date.now(),
              account,
              currency: account.currency,
              followed: null,
              followers: {},
              blackList: {},
              data: {},
              meta: {},
            };
            setProfile({ id: username, ...infos });
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
          .set({
            id,
            from: alias,
            message,
            data: {},
            meta: { creationDate: id },
          });
      }
    },
    [chan]
  );

  const createChannel = useCallback((id: string) => {
    const channel = Gun().get(id).put({ id, messages: {} });
    gun.get("channels").set(channel);
    // setChannels((channels) => [...channels, id]);
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
    sendMessage,
    useUpdateChannels,
    useUpdateMessages,
  };
};

export default useGun;
