import { ApplicantUser, CompanyUser } from "shared";

export interface UserInfo {
    // could make the user types if time, likely not
    // currentUserType: string | null;
    // username: string | null;
    user: ApplicantUser | CompanyUser | null;
    auth: string | null;
}