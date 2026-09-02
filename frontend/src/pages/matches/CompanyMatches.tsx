import { useEffect, useState } from "react";
import { Job, ApplicantUser, JobType } from "shared";
import { useUserInfo } from "../../userInfo/userInfoHooks.js";
import { useSearchParams } from "react-router-dom";

type CompanyMatch = {
  job: Job;
  applicant: ApplicantUser;
};

// const dummyMatches: Match[] = [
//   {
//     job: new Job(
//       "Frontend Developer",
//       null,
//       "Denver, CO",
//       92000,
//       JobType.fullTime,
//       "Build approachable, responsive hiring tools for growing teams.",
//       ["React", "TypeScript", "CSS"],
//     ),
//     applicant: new ApplicantUser(
//       "Maya",
//       "Patel",
//       "maya.patel",
//       "password",
//       "maya.patel@example.com",
//     ),
//   },
//   {
//     job: new Job(
//       "Backend Engineer",
//       null,
//       "Remote",
//       108000,
//       JobType.fullTime,
//       "Create reliable APIs and data flows for applicant matching.",
//       ["Node.js", "PostgreSQL", "API Design"],
//     ),
//     applicant: new ApplicantUser(
//       "Jordan",
//       "Lee",
//       "jordan.lee",
//       "password",
//       "jordan.lee@example.com",
//     ),
//   },
// ];

const CompanyMatches = () => {
//   const matches = dummyMatches;
  const [matches, setMatches] = useState<CompanyMatch[]>([]);
  const { user, auth } = useUserInfo();
  const [searchParams] = useSearchParams();
  const jobID = searchParams.get("job_id");

  useEffect(() => {
    const fetchMatches = async () => {
        const response = await fetch(
          `http://localhost:8000/api/matches/recruiter/?job_id=${jobID}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${auth}`,
            },
          },
        );
        const data = await response.json();
        if (!response.ok) {
            console.log(data);
            setMatches([]);
        } else {
            // user info is in resume object, read Emily
            // get is there for jobID, so that's easy
            // also, where do those fetch requests even go? in serperate file in seperate functions?
            console.log("FIX LATER");
        }
    }
  }, [])

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px" }}>
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "18px",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
          padding: "28px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "2rem", color: "#0f172a" }}>
            Mutual matches
          </h1>
          <p style={{ margin: "8px 0 0", color: "#475569" }}>
            Showing applicant matches for this job.
          </p>
        </div>

        {matches.length === 0 ? (
          <div
            style={{
              border: "1px dashed #cbd5e1",
              borderRadius: "14px",
              padding: "32px 20px",
              textAlign: "center",
              background: "#f8fafc",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.1rem", color: "#475569" }}>
              No matches found for this job yet.
            </p>
            <p style={{ margin: "8px 0 0", color: "#64748b" }}>
              Check back after more applicants have expressed interest.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {matches.map(({ job, applicant }, index) => (
              <div
                key={`${job.jobTitle}-${applicant.username}-${index}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px",
                  background: "#f8fafc",
                }}
              >
                <section>
                  <h2
                    style={{
                      margin: "0 0 10px",
                      fontSize: "1.25rem",
                      color: "#0f172a",
                    }}
                  >
                    {job.jobTitle}
                  </h2>
                  <p style={{ margin: "0 0 6px", color: "#475569" }}>
                    {job.location} · {job.type}
                  </p>
                  <p style={{ margin: "0 0 6px", color: "#475569" }}>
                    ${job.payPerYear.toLocaleString()} / year
                  </p>
                  <p style={{ margin: "0 0 10px", color: "#475569" }}>
                    {job.description}
                  </p>
                  <p style={{ margin: 0, color: "#64748b" }}>
                    Skills: {job.skillsNeeded.join(", ")}
                  </p>
                </section>

                <section>
                  <h2
                    style={{
                      margin: "0 0 10px",
                      fontSize: "1.25rem",
                      color: "#0f172a",
                    }}
                  >
                    {applicant.firstName} {applicant.lastName}
                  </h2>
                  <p style={{ margin: "0 0 6px", color: "#475569" }}>
                    @{applicant.username}
                  </p>
                  <p style={{ margin: 0, color: "#475569" }}>
                    {applicant.email}
                  </p>
                </section>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyMatches;
