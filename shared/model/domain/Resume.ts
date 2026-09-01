import { Education } from "./Education.js";
import { Experience } from "./Experience.js";

export class Resume {
  private _userID: number | null;
  private _personalSummary: string;
  private _education: Education[] = [];
  private _experiences: Experience[] = [];
  private _skills: string[] = [];

  public constructor(userID: number | null, personalSummary: string) {
    this._userID = userID;
    this._personalSummary = personalSummary;
  }

  public get userID(): number | null {
    return this._userID;
  }

  public get personalSummary(): string {
    return this._personalSummary;
  }

  public set personalSummary(summary: string) {
    this._personalSummary = summary;
  }

  public get education(): Education[] {
    return this._education;
  }

  public get experiences(): Experience[] {
    return this._experiences;
  }

  public get skills(): string[] {
    return this._skills;
  }

  public addEducation(education: Education) {
    this._education.push(education);
  }

  public addExperience(experience: Experience) {
    this._experiences.push(experience);
  }

  public addSkill(skill: string) {
    this._skills.push(skill);
  }

  private removeItem<T>(
    item: T,
    list: T[],
  ) {
    let removeIndex = 0
    for (let i = 0; i < list.length; i++) {
        if (list[i] === item) {
            removeIndex = i
        }
    }
    return list.filter((elem, index) => index !== removeIndex)
  };

  public removeEducation(education: Education) {
    this._education = this.removeItem(education, this._education);
  }

  public removeExperience(experience: Experience) {
    this._experiences = this.removeItem(experience, this._experiences);
  }

  public removeSkill(skill: string) {
    this._skills = this.removeItem(skill, this._skills);
  }
}