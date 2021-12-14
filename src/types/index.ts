import { Account, Transaction } from "@ledgerhq/live-app-sdk";

export type UserID = string;

export type CurrencyID = "ethereum" | "bitcoin";

export interface MetaData {
  creationDate: Date;
}

export interface File {
  id: string;
  url: string;
  mimeType: string;
  size?: number;
  meta: MetaData;
}

export interface Data {
  files?: File[];
  transaction?: Transaction;
}

export interface User {
  id: UserID;
  alias: string;
  account: Account;
  currency: CurrencyID;
  followers: UserID[];
  blackList: UserID[];
  data: Data;
  meta: MetaData;
}

export interface Room {
  id: string;
  name: string;
  private: boolean;
}

export interface Message {
  id: string;
  from: UserID;
  message: string;
  data: Data;
  meta: MetaData;
}

export interface Channel {
  id: string;
  name: string;
  users: UserID[];
  private: boolean;
  messages: Message[];
  data: Data;
  meta: MetaData;
}
