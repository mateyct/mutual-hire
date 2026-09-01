import { type Context, createContext } from "react";
import { type UserInfo } from "./userInfo.js";

export const UserInfoContext = createContext<UserInfo>({} as UserInfo);

interface UserInfoActions {
    updateUserInfo: (
        currentUserType: string,
        username: string,
        auth: string
    ) => void,
    clearUserInfo: () => void,
}

const defaultUserInfoActions: UserInfoActions = {
    updateUserInfo: () => null,
    clearUserInfo: () => null,
}

export const UserInfoActionsContext: Context<UserInfoActions> =
  createContext<UserInfoActions>(defaultUserInfoActions);