import { useCallback, useMemo, useState } from "react";
import { UserInfoContext, UserInfoActionsContext } from "./userInfoContext.js"
import { type UserInfo } from "./userInfo.js";

interface Props {
    children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        currentUserType: null,
        username: null,
        auth: null,
    });

    const updateUserInfo = useCallback(
        (currentUserType: string,
        username: string,
        auth: string) => {
            setUserInfo(() => {
                return {
                  currentUserType: currentUserType,
                  username: username,
                  auth: auth,
                };
            })
        }, []
    )

    const clearUserInfo = useCallback(
      () => {
        setUserInfo(() => {
          return {
            currentUserType: null,
            username: null,
            auth: null,
          };
        });
      },
      [],
    );

    const userInfoActions = useMemo(
        () => ({updateUserInfo, clearUserInfo}),
        [updateUserInfo, clearUserInfo]
    )

    return (
        <UserInfoContext.Provider value={userInfo}>
            <UserInfoActionsContext.Provider value={userInfoActions}>
                {children}
            </UserInfoActionsContext.Provider>
        </UserInfoContext.Provider>
    )
}

export default UserInfoProvider
