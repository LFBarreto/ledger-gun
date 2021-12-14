import React, { useState, useContext, useEffect } from "react";

import { GunContext } from "../src/components/GunProvider";
import { IGunChainReference } from "gun/types/chain";

type Message = { message: string; timestamp: number; uid: string };

// Generate one unique ID per user
// TODO: rework this
let uid = (() => {
  let s4 = () => {
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
})();

export default function Chat(): React.ReactElement {
  const gun = useContext(GunContext);
  // current message typed by the user
  const [message, setMessage] = useState<string>("");
  const [gunInstance, setGunInstance] = useState<null | IGunChainReference>(null);
  const [history, setHistory] = useState<Message[]>([]);

  const sendMessage = () => {
    if (!gunInstance) return;

    const data = { message: message, timestamp: Date.now(), uid };

    gunInstance.get("chat").set(data);

    // Clean the input and add the sent message to the local history
    setMessage("");
    setHistory((history) => [...history, data]);
  };

  useEffect(() => {
    if (!gun) return;

    const chatGunInstance = gun.get("chat");

    chatGunInstance.on((data: Message) => {
      // Don't add to the history if the message is from the user
      if (data.uid === uid) return;

      console.log("message received", data);
      setHistory((history) => [...history, data]);
    });

    setGunInstance(chatGunInstance);
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
            {history.map(({ message, uid }) => (
              <li key={uid}>{message}</li>
            ))}
          </ul>
        ) : (
          <p>no history yet...</p>
        )}
      </section>
    </main>
  );
}
