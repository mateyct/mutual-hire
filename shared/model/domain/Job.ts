import { ApplicantUser } from "./ApplicantUser.js";

export enum JobType {
    fullTime = "full_time",
    partTime = "part_time",
    intern = "internship"
}

export class Job {
  private _jobTitle: string;
  private _companyUserID: number | null;
  private _location: string;
  private _payPerYear: number;
  private _type: JobType;
  private _description: string;
  private _skillsNeeded: string[];
  // applicants who have swiped yes on this job (can only happen if applicant is qualified) will only be on backend ONLY
  // applicants who are qualified for this job
  private _qualifiedApplicants: ApplicantUser[] = [];
  // applicants that the company has swiped on, exchange contact info
  private _potentialHires: ApplicantUser[] = [];

  // ADD EDITING THE LISTS WHEN NEEDED!!!!

  public constructor(
    title: string,
    userID: number | null,
    location: string,
    pay: number,
    type: JobType,
    description: string,
    skills: string[],
  ) {
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

}
