import { type Context, createContext } from "react";
import { type UserInfo } from "./userInfo.js";
import { ApplicantUser, CompanyUser } from "shared";

export const UserInfoContext = createContext<UserInfo>({} as UserInfo);

export interface UserInfoActions {
    updateUserInfo: (
        user: ApplicantUser | CompanyUser | null,
        // currentUserType: string,
        // username: string,
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