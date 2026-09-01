import "./Match.css";
import Job from "./Job.js";
import ResumeMatch from "./Resume.js";
import { ApplicantUser } from "shared";

const Match = ({ userType, applicant }: { userType: string, applicant : ApplicantUser }) => {
  return (
    <div className="match-container">
      <div className="match-content">
        {userType === "CompanyUser" && <ResumeMatch applicant={applicant}/>}
        {userType === "ApplicantUser" && <Job />}
      </div>
      <div className="match-buttons">
        <button className="match-button reject-button">X</button>
        <button className="match-button accept-button">✓</button>
      </div>
    </div>
  );
};

export default Match;
