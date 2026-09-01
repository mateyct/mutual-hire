export enum DegreeType {
    highSchool = "High School",
    Bachelors = "Bachelor's",
    Masters = "Master's",
    PHD = "PHD"
}

export class Education {
    private _school: string;
    private _degree: string;
    private _degreeType: DegreeType;
    private _focus: string;
    private _gpa: number;
    private _start: Date;
    private _end: Date;
    private _description: string;

    public constructor(
        school: string,
        degree: string,
        degreeType: DegreeType,
        focus: string,
        gpa: number,
        start: Date,
        end: Date,
        description: string
    ) {
        this._school = school;
        this._degree = degree;
        this._degreeType = degreeType;
        this._focus = focus;
        this._gpa = gpa;
        this._start = start;
        this._end = end;
        this._description = description;
    }

    public get school(): string {
        return this._school;
    }

    public set school(school: string) {
        this._school = school;
    }

    public get degree(): string {
        return this._degree;
    }

    public set degree(degree: string) {
        this._degree = degree;
    }

    public get degreeType(): DegreeType {
        return this._degreeType;
    }

    public set degreeType(degreeType: DegreeType) {
        this._degreeType = degreeType;
    }

    public get focus(): string {
        return this._focus;
    }

    public set focus(focus: string) {
        this._focus = focus;
    }

    public get gpa(): number {
        return this._gpa;
    }

    public set gpa(gpa: number) {
        this._gpa = gpa;
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
}
