import "./Match.css";
import MatchJob from "./MatchJob.js";
import MatchResume from "./MatchResume.js";
import SideMenu from "../Menu.js";
import { ApplicantUser, CompanyUser, Job } from "shared";

//pls don't ask what's happening here
type ProposedMatch =
  | {
      type: "applicant";
      applicant: ApplicantUser;
    }
  | {
      type: "job";
      job: Job;
      company: CompanyUser;
    };

const Match = ({ proposedMatch }: { proposedMatch: ProposedMatch }) => {
  return (
    <>
      <SideMenu userType="applicant" />
      <div className="match-container">
        <div className="match-content">
          {proposedMatch.type === "applicant" && (
            <MatchResume applicant={proposedMatch.applicant} />
          )}

          {proposedMatch.type === "job" && (
            <MatchJob job={proposedMatch.job} company={proposedMatch.company} />
          )}
        </div>
        <div className="match-buttons">
          <button className="match-button reject-button">X</button>
          <button className="match-button accept-button">✓</button>
        </div>
      </div>
    </>
  );
};

export default Match;
