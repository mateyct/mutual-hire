import "./Match.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MatchJob from "./MatchJob.js";
import MatchResume from "./MatchResume.js";
import SideMenu from "../Menu.js";
import { useUserInfo } from "../../userInfo/userInfoHooks.js";
import { ApplicantUser, CompanyUser, Job } from "shared";

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

const Match = () => {
  const { user, auth } = useUserInfo();
  const [queue, setQueue] = useState<ProposedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // If a company is matching, they need to provide the job_id they are matching for in the URL
  // Example: /company/match?job_id=5
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job_id");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Determine user type (adjust this check based on your exact user object structure)
        const isCompany = user && 'companyName' in user; 

        // 1. Pick the correct endpoint based on who is logged in
        let endpoint = "";
        if (isCompany) {
          if (!jobId) throw new Error("Missing job_id in URL");
          endpoint = `http://127.0.0.1:8000/api/matching/resumes/?job_id=${jobId}`;
        } else {
          endpoint = `http://127.0.0.1:8000/api/matching/jobs/`;
        }

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${auth}`,
          },
        });

        if (response.status === 404) {
          setQueue([]);
          setLoading(false);
          return;
        }
        
        if (!response.ok) throw new Error("Failed to fetch matches");
        
        const data = await response.json();

        // 2. Format the data based on what came back
        let formattedMatches: ProposedMatch[] = [];
        
        if (isCompany) {
          // Format incoming resumes into Applicant cards
          formattedMatches = data.map((djangoResume: any) => ({
            type: "applicant",
            applicant: {
              firstName: djangoResume.owner_first_name || "Applicant", // Map based on your serializer
              lastName: djangoResume.owner_last_name || "",
              resume: {
                id: djangoResume.id,
                personalSummary: djangoResume.summary,
                skills: djangoResume.skills || [],
                experiences: djangoResume.experiences || [],
                education: djangoResume.education || [],
              }
            }
          }));
        } else {
          // Format incoming jobs into Job cards
          formattedMatches = data.map((djangoJob: any) => ({
            type: "job",
            job: {
              id: djangoJob.id,
              jobTitle: djangoJob.title,
              location: djangoJob.location,
              payPerYear: parseFloat(djangoJob.pay),
              type: djangoJob.type,
              description: djangoJob.description,
              skillsNeeded: djangoJob.skills || [],
            },
            company: { 
              companyName: djangoJob.company_name || "Company"
            }
          }));
        }

        setQueue(formattedMatches);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user && auth) {
      fetchMatches();
    }
  }, [user, auth, jobId]);

  if (loading) return <div>Loading your best matches...</div>;

  const currentMatch = queue[0];
  if (!currentMatch) return <div>No more matches available right now!</div>;

  // Render the current user type for the SideMenu
  const menuType = (user && 'companyName' in user) ? "company" : "applicant";

  return (
    <>
      <SideMenu userType={menuType} />
      <div className="match-container">
        <div className="match-content">
          {currentMatch.type === "applicant" && (
            <MatchResume applicant={currentMatch.applicant} />
          )}

          {currentMatch.type === "job" && (
            <MatchJob job={currentMatch.job} company={currentMatch.company} />
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