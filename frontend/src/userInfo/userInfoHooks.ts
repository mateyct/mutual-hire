import { useContext } from "react";
import { UserInfoContext, UserInfoActionsContext } from "./userInfoContext.js"

export const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
};

export const useUserInfo = () => {
    return useContext(UserInfoContext);
}