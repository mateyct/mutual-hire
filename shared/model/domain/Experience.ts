export enum ExperienceType {
    fullTime = "Full Time",
    partTime = "Part Time",
    intern = "Internship",
    personalProject = "Personal Project"
}

export class Experience {
    private _title: string;
    private _company: string;
    private _start: Date;
    private _end: Date;
    private _description: string;
    private _type: ExperienceType;

    public constructor(
        title: string,
        company: string,
        start: Date,
        end: Date,
        description: string,
        type: ExperienceType
    ) {
        this._title = title;
        this._company = company;
        this._start = start;
        this._end = end;
        this._description = description;
        this._type = type;
    }

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
    }

    public get company(): string {
        return this._company;
    }

    public set company(company: string) {
        this._company = company;
    }

    public get start(): Date {
        return this._start;
    }

    public set start(start: Date) {
        this._start = start;
    }

    public get end(): Date {
        return this._end;
    }

    public set end(end: Date) {
        this._end = end;
    }

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
    }

    public get type(): ExperienceType {
        return this._type;
    }

    public set type(type: ExperienceType) {
        this._type = type;
    }
}
