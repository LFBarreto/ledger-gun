import { Account, Transaction } from "@ledgerhq/live-app-sdk";

type UserID = string;

type CurrencyID = "ethereum" | "bitcoin";

interface MetaData {
  creationDate: Date;
}

interface File {
  id: string;
  url: string;
  mimeType: string;
  size?: number;
  meta: MetaData;
}

interface Data {
  files?: File[];
  transaction?: Transaction;
}

// @ts-expect-error unused for now
interface User {
  id: UserID;
  alias: string;
  account: Account;
  currency: CurrencyID;
  followers: UserID[];
  blackList: UserID[];
  data: Data;
  meta: MetaData;
}

interface Message {
  id: string;
  from: UserID;
  message: string;
  data: Data;
  meta: MetaData;
}

// @ts-expect-error unused for now
interface Channel {
  id: string;
  name: string;
  users: UserID[];
  private: boolean;
  messages: Message[];
  data: Data;
  meta: MetaData;
}
