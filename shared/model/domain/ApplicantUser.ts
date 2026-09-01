import { Resume } from "./Resume";
import { Job } from "./Job";

export class ApplicantUser {
  private _firstName: string;
  private _lastName: string;
  private _userID: number | null = null;
  private _username: string;
  private _password: string;
  private _email: string;
  private _resume: Resume | null = null;
  // all the jobs they qualify for, according to our system
  private _jobsQualified: Job[] = [];
  // all the jobs the applicant has swiped yes on, visible to applicant
  private _jobsInterested: Job[] = [];
  // all the jobs that companies have swiped yes on them for, exchange contact info
  private _potentialHire: Job[] = [];

  // ADD EDITING THE LISTS WHEN NEEDED!!!!

  public constructor(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string
  ) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._username = username;
    this._password = password;
    this._email = email;
  }

  public get resume() {
    return this._resume;
  }

  public set resume(resume: Resume | null) {
    this._resume = resume;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(firstName: string) {
    this._firstName = firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(lastName: string) {
    this._lastName = lastName;
  }

  public get userID(): number | null {
    return this._userID;
  }

  public set userID(userID: number | null) {
    this._userID = userID;
  }

  public get username(): string {
    return this._username;
  }

  public set username(username: string) {
    this._username = username;
  }

  public get password() {
    return this._password;
  }

  public get email(): string {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }
}
