import { CompanyUser, Job } from "shared";

const MatchJob = ({ company, job }: { company: CompanyUser; job: Job }) => {

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "420px",
        maxWidth: "100%",
        maxHeight: "70vh",
        overflowY: "auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        color: "#111827",
        fontFamily: "Arial, sans-serif",
        textAlign: "left"
      }}
    >
      <h2 style={{ margin: "0 0 20px", textAlign: "center" }}>{job.jobTitle}</h2>

      <div style={{ marginBottom: "20px", fontWeight: 600 }}>{company.companyName}</div>

      <section style={{ marginBottom: "20px" }}>
        <div>
          <strong>Location:</strong> {job.location}
        </div>
        <div>
          <strong>Type:</strong> {job.type}
        </div>
        <div>
          <strong>Pay:</strong> ${job.payPerYear.toLocaleString()} /
          year
        </div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 10px" }}>Description</h3>
        <p style={{ margin: 0, lineHeight: 1.6 }}>{job.description}</p>
      </section>

      <section>
        <h3 style={{ margin: "0 0 10px" }}>Skills Needed</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {job.skillsNeeded.length > 0 ? (
            job.skillsNeeded.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                style={{
                  background: "#f3f4f6",
                  borderRadius: "999px",
                  padding: "6px 10px",
                  fontSize: "14px",
                }}
              >
                {skill}
              </span>
            ))
          ) : (
            <p style={{ margin: 0 }}>No skills listed.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MatchJob;
