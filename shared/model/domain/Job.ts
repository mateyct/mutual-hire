import { ApplicantUser } from "./ApplicantUser";

export enum JobType {
    fullTime = "Full Time",
    partTime = "Part Time",
    intern = "Internship"
}

export class Job {
    private _jobTitle: string;
    private _companyUserID: number | null;
    private _location: string;
    private _payPerYear: number;
    private _type: JobType;
    private _description: string;
    private _skillsNeeded: string[];
    private _interestedApplicants: ApplicantUser[] = [];

    public constructor(title: string, userID: number | null, location: string, pay: number, type: JobType, description: string, skills: string[]) {
        this._jobTitle = title;
        this._companyUserID = userID;
        this._location = location;
        this._payPerYear = pay;
        this._type = type;
        this._description = description;
        this._skillsNeeded = skills;
    }

    public get jobTitle(): string {
        return this._jobTitle;
    }

    public set jobTitle(jobTitle: string) {
        this._jobTitle = jobTitle;
    }

    public get companyUserID(): number | null {
        return this._companyUserID;
    }

    public set companyUserID(companyUserID: number | null) {
        this._companyUserID = companyUserID;
    }

    public get location(): string {
        return this._location;
    }

    public set location(location: string) {
        this._location = location;
    }

    public get payPerYear(): number {
        return this._payPerYear;
    }

    public set payPerYear(payPerYear: number) {
        this._payPerYear = payPerYear;
    }

    public get type(): JobType {
        return this._type;
    }

    public set type(type: JobType) {
        this._type = type;
    }

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
    }

    public get skillsNeeded(): string[] {
        return this._skillsNeeded;
    }

    public set skillsNeeded(skillsNeeded: string[]) {
        this._skillsNeeded = skillsNeeded;
    }

    public addInterested(user: ApplicantUser) {
        this._interestedApplicants.push(user);
    }

    public removeInterested(user: ApplicantUser) {
        let removeIndex = 0
        for (let i = 0; i < this._interestedApplicants.length; i++) {
            if (this._interestedApplicants[i] == user) {
                removeIndex = i;
            }
        }
        this._interestedApplicants = this._interestedApplicants.filter((elem, index) => index !== removeIndex);
    }
}
