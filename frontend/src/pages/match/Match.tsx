import "./Match.css";
import { useState, useEffect, useCallback } from "react";
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
  
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job_id");
  const isCompany = user && 'companyName' in user;

  // Wrap fetch logic in useCallback so it can be called whenever we run out of cards
  const fetchMatches = useCallback(async () => {
    try {
      if (!auth) return;

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

      let formattedMatches: ProposedMatch[] = [];
      
      if (isCompany) {
        formattedMatches = data.map((djangoResume: any) => ({
          type: "applicant",
          applicant: {
            firstName: djangoResume.owner_first_name || "Applicant",
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
  }, [auth, jobId, isCompany]);

  useEffect(() => {
    if (user && auth) {
      fetchMatches();
    }
  }, [user, auth, fetchMatches]);

  // Handle the swipe action when clicking X (false) or Check (true)
  const handleSwipe = async (isInterested: boolean) => {
    const currentMatch = queue[0];
    if (!currentMatch) return;

    let targetJobId: number | null = null;
    let targetResumeId: number | null = null;

    if (isCompany) {
      targetJobId = jobId ? parseInt(jobId, 10) : null;
      targetResumeId = currentMatch.type === "applicant" ? currentMatch.applicant.resume?.id ?? null : null;
    } else {
      targetJobId = currentMatch.type === "job" ? (currentMatch.job as any).id ?? null : null;
    }

    if (!targetJobId || (isCompany && !targetResumeId)) {
      console.error("Missing required IDs for swipe request.", { targetJobId, targetResumeId });
      return;
    }

    // 1. Optimistically remove the top card to instantly advance the UI queue
    setQueue((prevQueue) => {
      const updatedQueue = prevQueue.slice(1);
      
      // If the queue just became empty, trigger a background refetch for more matches!
      if (updatedQueue.length === 0) {
        setLoading(true);
        fetchMatches();
      }
      
      return updatedQueue;
    });

    try {
      const payload: any = {
        job_id: targetJobId,
        is_interested: isInterested,
      };

      if (isCompany) {
        payload.resume_id = targetResumeId;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/swipe/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${auth}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to record swipe");

      const data = await response.json();

      if (data.is_mutual_match) {
        alert("It's a Mutual Match! 🎉");
      }
    } catch (error) {
      console.error("Error processing swipe:", error);
    }
  };

  if (loading) return <div>Loading your best matches...</div>;

  const currentMatch = queue[0];
  if (!currentMatch) return <div>No more matches available right now!</div>;

  const menuType = isCompany ? "company" : "applicant";

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
          <button 
            onClick={() => handleSwipe(false)} 
            className="match-button reject-button"
          >
            X
          </button>
          <button 
            onClick={() => handleSwipe(true)} 
            className="match-button accept-button"
          >
            ✓
          </button>
        </div>
      </div>
    </>
  );
};

export default Match;