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

let gun: any;
let user: any;

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

  console.log(messages);

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
  createChannel: (id: string) => void;
  messages: any[];
  sendMessage: (message: string) => void;
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
      setChannels(Object.keys(ids));
    });

    return () => gun.off();
  }, []);

  useEffect(() => {
    /*
    const match = {
      // lexical queries are kind of like a limited RegEx or Glob.
      ".": {
        // property selector
        ">": new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
      },
      "-": 1, // filter in reverse
    };
    */
    gun
      .get("channels")
      .get(chan)
      .get("messages")
      .on((msgs: any) => {
        console.log({ msgs });
        if (msgs) {
          console.log(msgs);
          setMessages((m: any) => {
            if (!m[chan]) m[chan] = [];
            m[chan] = m[chan].concat(msgs).slice(0, 100);
            return m;
          });
        }
      });
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

  /*
  const getChannelMessages = useCallback((id) => {
    const match = {
      // lexical queries are kind of like a limited RegEx or Glob.
      ".": {
        // property selector
        ">": new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
      },
      "-": 1, // filter in reverse
    };

    gun
      .get("channels")
      .get(id)
      .map(match)
      .once(async (data, id) => {
        if (data) {
          // Key for end-to-end encryption
          const key = "#foo";
          const message = {
            // transform the data
            who: await gun.user(data).get("alias"), // a user might lie who they are! So let the user system detect whose data it is.
            what: data,
            when: Gun.state.is(data, "what"), // get the internal timestamp for the what property.
          };
          if (message.what) {
            messages = [...messages.slice(-100), message].sort(
              (a, b) => a.when - b.when
            );
            if (canAutoScroll) {
              autoScroll();
            } else {
              unreadMessages = true;
            }
          }
        }
      });
  }, []);
  */

  const sendMessage = useCallback(
    (message) => {
      if (chan) {
        const id = new Date().toISOString();
        console.log(id, chan);
        gun
          .get("chans")
          .get(chan)
          .get("messages")
          .get(id)
          .put({
            id,
            from: profile.alias,
            message,
            data: {},
            meta: { creationDate: id },
          });
      }
    },
    [chan, profile]
  );

  const createChannel = useCallback((id: string) => {
    gun.get("channels").get(id).put({ id, messages: {} });
  }, []);

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
    createChannel,
    messages: chan ? messages?.[chan] ?? [] : [],
    sendMessage,
  };
};

export default useGun;
