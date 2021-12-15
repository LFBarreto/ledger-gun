import { keyBy } from "lodash";
import { User, UserID } from "../types";

export function getUsersMappedByKey(users: User[]): Record<UserID, User> {
  return keyBy(users, "id");
}

export function findUsersFromIds(userIds: UserID[], allUsers: User[]): User[] {
  const usersMappedByKey = getUsersMappedByKey(allUsers);
  const res = [];
  for (const userId of userIds) {
    const entry = usersMappedByKey[userId];
    if (entry) res.push(entry);
  }
  return res;
}
