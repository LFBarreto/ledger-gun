import React, { useState, useContext, useEffect } from "react";
import { GunContext } from "../src/components/GunProvider";
import { IGunChainReference } from "gun/types/chain";
import "gun/sea";

// const user = gun.user()
// const user3 = user.auth("@yolo3", "1234abcd", (ack) => console.log("logged @yolo3", {ack}))
// const user2 = user.auth("@yolo2", "1234abcd", (ack) => console.log("logged @yolo2", {ack}))
// user3.get("alias").once(data => console.log("user3", data))
// user2.get("alias").once(data => console.log("user2", data))

type Message = {
  message: string;
  timestamp: number;
  uid: string;
  from: string;
};

// TODO: rework this
// Generate one unique ID per user
const uidGenerator = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

const userUid = uidGenerator();

export default function Chat(): React.ReactElement {
  const gun = useContext(GunContext);

  // current message typed by the user
  const [message, setMessage] = useState<string>("");
  const [loaded, isLoaded] = useState(false);
  const [gunInstance, setGunInstance] = useState<null | IGunChainReference>(
    null
  );
  const [history, setHistory] = useState<Message[]>([]);

  const sendMessage = () => {
    if (!gunInstance) return;

    const data = {
      message: message,
      timestamp: Date.now(),
      uid: uidGenerator(),
      from: userUid,
    };

    gunInstance.get("message").set(data);

    // Clean the input and add the sent message to the local history
    setMessage("");
    setHistory((history) => [...history, data]);
  };

  useEffect(() => {
    if (!gun) return;
    if (loaded) return;

    const chatGunInstance = gun.get("chat");

    chatGunInstance
      .get("message")
      .map()
      .on((data: Message) => {
        console.log('received', data);
        // Don't add to the history if the message is from the user
        if (data.from === userUid) return;

        setHistory((history) => {
          if (history.find((message) => message.uid === data.uid))
            return history;
          return [...history, data];
        });
      });
    setGunInstance(chatGunInstance);

    isLoaded(true);
    return () => chatGunInstance.off();
  }, [gun]);

  return (
    <main style={{ color: "white" }}>
      <section style={{ display: "flex" }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          cols={35}
          style={{ color: "black" }}
        />
        <button disabled={!message.length} onClick={sendMessage}>
          Send
        </button>
      </section>
      <section>
        {history.length ? (
          <ul>
            {history.map(({ message }, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        ) : (
          <p>no history yet...</p>
        )}
      </section>
    </main>
  );
}
