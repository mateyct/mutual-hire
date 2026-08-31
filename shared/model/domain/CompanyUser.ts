import { Job, JobType } from "./Job"

export class CompanyUser {
    private _companyName: string;
    private _password: string;
    private _description: string;
    private _jobs: Job[] = [];
    private _userID: number | null = null;

    public constructor(companyName: string, password: string, description: string) {
        this._companyName = companyName;
        this._password = password;
        this._description = description
    }

    public get companyName() {
        return this._companyName;
    }

    public set companyName(name: string) {
        this._companyName = name;
    }

    public get description() {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
    }

    public get userID() {
        return this._userID;
    }

    public set userID(id: number | null) {
        this._userID = id;
    }

    public addJob(title: string, location: string, pay: number, type: JobType, description: string, skills: string[]) {
        this._jobs.push(new Job(title, this._userID, location, pay, type, description, skills));
    }

    public removeJob(job: Job) {
        let removeIndex = 0;
        for (let i = 0; i < this._jobs.length; i++) {
          if (this._jobs[i] == job) {
            removeIndex = i;
          }
        };
        this._jobs = this._jobs.filter((elem, index) => index !== removeIndex);
    }
}