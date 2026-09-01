import { ApplicantUser, CompanyUser } from "shared";

export interface UserInfo {
    // could make the user types if time, likely not
    currentUserType: string | null;
    username: string | null;
    auth: string | null;
}