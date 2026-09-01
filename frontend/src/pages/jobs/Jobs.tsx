import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../Menu.js";
import { Job } from "shared";
import { useUserInfo } from "../../userInfo/userInfoHooks.js";

const Jobs = () => {
  const navigate = useNavigate();
  const { user, auth } = useUserInfo();
  const [jobListings, setJobListings] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobListings = async () => {
      const response = await fetch("http://localhost:8000/api/job/", {
        method: "GET",
        headers: {
          Authorization: `Token ${auth}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json()
      if (response.ok) {
        const companyUserID =
          (user as { _userID?: number | null } | null)?._userID ?? null;
        const jobs: Job[] = data.map(
          (job: {
            title: string;
            jobTitle?: string;
            location: string;
            pay: number;
            payPerYear?: number;
            type: Job["type"];
            description: string;
            skills: string[];
            skillsNeeded?: string[];
          }) =>
            new Job(
              job.title ?? job.jobTitle,
              companyUserID,
              job.location,
              job.pay ?? job.payPerYear,
              job.type,
              job.description,
              job.skills ?? job.skillsNeeded,
            ),
        );
        setJobListings(jobs);
      } else {
        console.log(data);
        setJobListings([]);
      }
    }

    fetchJobListings();
  }, [user]);

  return (
    <>
      <SideMenu userType="company" />
      <div
        style={{
          minHeight: "100vh",
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "18px",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            padding: "28px",
          }}
        >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#0f172a" }}>
              Your job listings
            </h1>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>
              Manage the jobs you have posted.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/company/job")}
            style={{
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "#ffffff",
              padding: "12px 18px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            + Add job
          </button>
        </div>

        {jobListings.length === 0 ? (
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
              You have not created any job listings yet.
            </p>
            <p style={{ margin: "8px 0 0", color: "#64748b" }}>
              Click “Add job” to create your first listing.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {jobListings.map((job, index) => (
              <div
                key={`${job.jobTitle}-${index}`}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px",
                  background: "#f8fafc",
                }}
              >
                <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem", color: "#0f172a" }}>
                  {job.jobTitle}
                </h2>
                <p style={{ margin: "0 0 6px", color: "#475569" }}>
                  {job.location} · {job.type}
                </p>
                <p style={{ margin: 0, color: "#475569" }}>
                  ${job.payPerYear.toLocaleString()} / year
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Jobs;
