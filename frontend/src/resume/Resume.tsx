import { useState } from "react";
import SideMenu from "../pages/Menu.js";
import { useUserInfo } from "../userInfo/userInfoHooks.js";

type ExperienceTypeValue = "full_time" | "part_time" | "internship";

type EducationDraft = {
  id: number;
  title: string;
  degree: string;
  major: string;
  gpa: string;
  start: string;
  end: string;
  description: string;
  saved: boolean;
};

type ExperienceDraft = {
  id: number;
  title: string;
  company: string;
  start: string;
  end: string;
  currentJob: boolean;
  description: string;
  type: ExperienceTypeValue;
  saved: boolean;
};

const createEmptyEducation = (id: number): EducationDraft => ({
  id,
  title: "",
  degree: "",
  major: "",
  gpa: "",
  start: "",
  end: "",
  description: "",
  saved: false,
});

const createEmptyExperience = (id: number): ExperienceDraft => ({
  id,
  title: "",
  company: "",
  start: "",
  end: "",
  currentJob: false,
  description: "",
  type: "full_time",
  saved: false,
});

const ResumePage = () => {
  const { auth } = useUserInfo();
  const [personalSummary, setPersonalSummary] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [educationEntries, setEducationEntries] = useState<EducationDraft[]>(
    [],
  );
  const [experienceEntries, setExperienceEntries] = useState<ExperienceDraft[]>(
    [],
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();

    if (!trimmedSkill || skills.includes(trimmedSkill)) {
      setSkillInput("");
      return;
    }

    setSkills((previous) => [...previous, trimmedSkill]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((previous) =>
      previous.filter((skill) => skill !== skillToRemove),
    );
  };

  const addEducationEntry = () => {
    setEducationEntries((previous) => [
      ...previous,
      createEmptyEducation(Date.now() + Math.random()),
    ]);
  };

  const updateEducationEntry = (
    id: number,
    field: keyof Omit<EducationDraft, "id" | "saved">,
    value: string,
  ) => {
    setEducationEntries((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const saveEducationEntry = (id: number) => {
    setEducationEntries((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, saved: true } : entry,
      ),
    );
  };

  const removeEducationEntry = (id: number) => {
    setEducationEntries((previous) =>
      previous.filter((entry) => entry.id !== id),
    );
  };

  const addExperienceEntry = () => {
    setExperienceEntries((previous) => [
      ...previous,
      createEmptyExperience(Date.now() + Math.random()),
    ]);
  };

  const updateExperienceEntry = (
    id: number,
    field: keyof Omit<ExperienceDraft, "id" | "saved">,
    value: string | boolean | ExperienceTypeValue,
  ) => {
    setExperienceEntries((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const saveExperienceEntry = (id: number) => {
    setExperienceEntries((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, saved: true } : entry,
      ),
    );
  };

  const removeExperienceEntry = (id: number) => {
    setExperienceEntries((previous) =>
      previous.filter((entry) => entry.id !== id),
    );
  };

  const buildResumePayload = () => {
    const validEducation = educationEntries
      .filter((entry) => entry.saved)
      .map((entry) => {
        if (
          !entry.title.trim() ||
          !entry.degree.trim() ||
          !entry.major.trim()
        ) {
          throw new Error(
            "Each saved education entry needs a school, degree, and major.",
          );
        }

        if (!entry.start) {
          throw new Error("Each saved education entry needs a start date.");
        }

        const gpaValue = entry.gpa.trim();
        const numericGpa = gpaValue ? Number(gpaValue) : null;
        if (
          gpaValue &&
          (numericGpa === null ||
            Number.isNaN(numericGpa) ||
            numericGpa < 0 ||
            numericGpa > 4)
        ) {
          throw new Error("Education GPA must be between 0 and 4.");
        }

        return {
          title: entry.title.trim(),
          degree: entry.degree.trim(),
          major: entry.major.trim(),
          gpa: numericGpa,
          start_date: entry.start,
          end_date: entry.end || null,
          description: entry.description.trim(),
        };
      });

    const validExperience = experienceEntries
      .filter((entry) => entry.saved)
      .map((entry) => {
        if (!entry.title.trim() || !entry.company.trim()) {
          throw new Error(
            "Each saved experience entry needs a title and company.",
          );
        }

        if (!entry.start) {
          throw new Error("Each saved experience entry needs a start date.");
        }

        if (!entry.currentJob && !entry.end) {
          throw new Error(
            "Experience end date is required unless the job is current.",
          );
        }

        if (entry.type !== "full_time" && entry.type !== "part_time" && entry.type !== "internship") {
          throw new Error("Experience type must be either job or project.");
        }

        return {
          title: entry.title.trim(),
          company: entry.company.trim(),
          start_date: entry.start,
          end_date: entry.currentJob ? null : entry.end,
          current_job: entry.currentJob,
          description: entry.description.trim(),
          type: entry.type,
        };
      });

    if (!personalSummary.trim()) {
      throw new Error("Personal summary is required.");
    }

    return {
      summary: personalSummary.trim(),
      experience: validExperience,
      education: validEducation,
      skills: skills.map((skill) => skill.trim()).filter(Boolean),
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!auth) {
      setSubmitError("You must be logged in to save your resume.");
      return;
    }

    try {
      const payload = buildResumePayload();

      const response = await fetch("http://localhost:8000/api/resume/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${auth}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData?.detail ||
          errorData?.non_field_errors?.[0] ||
          "The resume could not be saved.";
        throw new Error(message);
      }

      setSubmitSuccess("Resume saved successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The resume could not be saved.";
      setSubmitError(message);
    }
  };

  const unsavedEducation = educationEntries.filter((entry) => !entry.saved);
  const savedEducation = educationEntries.filter((entry) => entry.saved);
  const unsavedExperience = experienceEntries.filter((entry) => !entry.saved);
  const savedExperience = experienceEntries.filter((entry) => entry.saved);

  return (
    <>
      <SideMenu userType="applicant" />
      <div
        style={{
          minHeight: "100vh",
          padding: "10px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            padding: "20px",
          }}
        >
          <h1 style={{ margin: "0 0 8px", fontSize: "2rem" }}>
            Create your resume
          </h1>
          <p style={{ margin: "0 0 24px", color: "#475569" }}>
            Add your personal summary, experience, education, and skills.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "24px" }}
          >
            <section>
              <h2 style={{ marginBottom: "12px" }}>Personal summary</h2>
              <textarea
                value={personalSummary}
                onChange={(event) => setPersonalSummary(event.target.value)}
                placeholder="Describe yourself and your career goals"
                rows={5}
                required
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </section>

            <section>
              <h2 style={{ marginBottom: "12px" }}>Skills</h2>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "#f3f4f6",
                          borderRadius: "999px",
                          padding: "6px 10px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#374151",
                            cursor: "pointer",
                            fontSize: "14px",
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#6b7280" }}>
                      No skills added yet.
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill and press Enter"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    style={secondaryButtonStyle}
                  >
                    Add skill
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h2 style={{ margin: 0 }}>Education</h2>
                <button
                  type="button"
                  onClick={addEducationEntry}
                  style={secondaryButtonStyle}
                >
                  + Add education
                </button>
              </div>

              <div style={{ display: "grid", gap: "18px" }}>
                {unsavedEducation.map((entry) => (
                  <div key={entry.id} style={draftCardStyle}>
                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>School / university</label>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(event) =>
                          updateEducationEntry(
                            entry.id,
                            "title",
                            event.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>Degree</label>
                      <input
                        type="text"
                        value={entry.degree}
                        onChange={(event) =>
                          updateEducationEntry(
                            entry.id,
                            "degree",
                            event.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>Major</label>
                      <input
                        type="text"
                        value={entry.major}
                        onChange={(event) =>
                          updateEducationEntry(
                            entry.id,
                            "major",
                            event.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>GPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={entry.gpa}
                        onChange={(event) =>
                          updateEducationEntry(
                            entry.id,
                            "gpa",
                            event.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "14px",
                      }}
                    >
                      <div style={fieldRowStyle}>
                        <label style={labelStyle}>Start date</label>
                        <input
                          type="date"
                          value={entry.start}
                          onChange={(event) =>
                            updateEducationEntry(
                              entry.id,
                              "start",
                              event.target.value,
                            )
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div style={fieldRowStyle}>
                        <label style={labelStyle}>End date</label>
                        <input
                          type="date"
                          value={entry.end}
                          onChange={(event) =>
                            updateEducationEntry(
                              entry.id,
                              "end",
                              event.target.value,
                            )
                          }
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>Description</label>
                      <textarea
                        value={entry.description}
                        onChange={(event) =>
                          updateEducationEntry(
                            entry.id,
                            "description",
                            event.target.value,
                          )
                        }
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" }}
                      />
                    </div>

                    <div
                      style={{ display: "flex", gap: "10px", marginTop: "8px" }}
                    >
                      <button
                        type="button"
                        onClick={() => saveEducationEntry(entry.id)}
                        style={primaryButtonStyle}
                      >
                        Save education
                      </button>
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(entry.id)}
                        style={dangerButtonStyle}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {savedEducation.map((entry) => (
                  <div key={entry.id} style={savedCardStyle}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <strong>Education</strong>
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(entry.id)}
                        style={miniRemoveButtonStyle}
                      >
                        ×
                      </button>
                    </div>
                    <div>School / university: {entry.title || "N/A"}</div>
                    <div>Degree: {entry.degree || "N/A"}</div>
                    <div>Major: {entry.major || "N/A"}</div>
                    <div>GPA: {entry.gpa || "N/A"}</div>
                    <div>Start: {entry.start || "N/A"}</div>
                    <div>End: {entry.end || "N/A"}</div>
                    <div>Description: {entry.description || "N/A"}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h2 style={{ margin: 0 }}>Experience</h2>
                <button
                  type="button"
                  onClick={addExperienceEntry}
                  style={secondaryButtonStyle}
                >
                  + Add experience
                </button>
              </div>

              <div style={{ display: "grid", gap: "18px" }}>
                {unsavedExperience.map((entry) => (
                  <div key={entry.id} style={draftCardStyle}>
                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>Title</label>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(event) =>
                          updateExperienceEntry(
                            entry.id,
                            "title",
                            event.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>Company</label>
                      <input
                        type="text"
                        value={entry.company}
                        onChange={(event) =>
                          updateExperienceEntry(
                            entry.id,
                            "company",
                            event.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>Type</label>
                      <select
                        value={entry.type}
                        onChange={(event) =>
                          updateExperienceEntry(
                            entry.id,
                            "type",
                            event.target.value as ExperienceTypeValue,
                          )
                        }
                        style={inputStyle}
                      >
                        <option value="job">job</option>
                        <option value="project">project</option>
                      </select>
                    </div>

                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>Currently employed here</label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={entry.currentJob}
                          onChange={(event) =>
                            updateExperienceEntry(
                              entry.id,
                              "currentJob",
                              event.target.checked,
                            )
                          }
                        />
                        <span>Current job</span>
                      </label>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "14px",
                      }}
                    >
                      <div style={fieldRowStyle}>
                        <label style={labelStyle}>Start date</label>
                        <input
                          type="date"
                          value={entry.start}
                          onChange={(event) =>
                            updateExperienceEntry(
                              entry.id,
                              "start",
                              event.target.value,
                            )
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div style={fieldRowStyle}>
                        <label style={labelStyle}>End date</label>
                        <input
                          type="date"
                          value={entry.end}
                          disabled={entry.currentJob}
                          onChange={(event) =>
                            updateExperienceEntry(
                              entry.id,
                              "end",
                              event.target.value,
                            )
                          }
                          style={{
                            ...inputStyle,
                            opacity: entry.currentJob ? 0.6 : 1,
                          }}
                        />
                      </div>
                    </div>

                    <div style={fieldRowStyle}>
                      <label style={labelStyle}>Description</label>
                      <textarea
                        value={entry.description}
                        onChange={(event) =>
                          updateExperienceEntry(
                            entry.id,
                            "description",
                            event.target.value,
                          )
                        }
                        rows={4}
                        style={{ ...inputStyle, resize: "vertical" }}
                      />
                    </div>

                    <div
                      style={{ display: "flex", gap: "10px", marginTop: "8px" }}
                    >
                      <button
                        type="button"
                        onClick={() => saveExperienceEntry(entry.id)}
                        style={primaryButtonStyle}
                      >
                        Save experience
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExperienceEntry(entry.id)}
                        style={dangerButtonStyle}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {savedExperience.map((entry) => (
                  <div key={entry.id} style={savedCardStyle}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <strong>Experience</strong>
                      <button
                        type="button"
                        onClick={() => removeExperienceEntry(entry.id)}
                        style={miniRemoveButtonStyle}
                      >
                        ×
                      </button>
                    </div>
                    <div>Title: {entry.title || "N/A"}</div>
                    <div>Company: {entry.company || "N/A"}</div>
                    <div>Type: {entry.type || "N/A"}</div>
                    <div>Current job: {entry.currentJob ? "Yes" : "No"}</div>
                    <div>Start: {entry.start || "N/A"}</div>
                    <div>End: {entry.end || "N/A"}</div>
                    <div>Description: {entry.description || "N/A"}</div>
                  </div>
                ))}
              </div>
            </section>

            {submitError ? (
              <div style={{ color: "#b91c1c", fontWeight: 600 }}>
                {submitError}
              </div>
            ) : null}
            {submitSuccess ? (
              <div style={{ color: "#15803d", fontWeight: 600 }}>
                {submitSuccess}
              </div>
            ) : null}

            <button type="submit" style={primaryButtonStyle}>
              Save resume
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "1rem",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  boxSizing: "border-box",
  background: "#ffffff",
  color: "#111827",
};

const draftCardStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "18px",
  background: "#f8fafc",
};

const savedCardStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
  border: "1px solid #dbeafe",
  borderRadius: "10px",
  padding: "12px 14px",
  background: "#eff6ff",
  color: "#1e293b",
};

const fieldRowStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#1e293b",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "#fff",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  background: "#f8fafc",
  cursor: "pointer",
  color: "#111827",
  fontWeight: 600,
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid #fecaca",
  borderRadius: "10px",
  background: "#fff1f2",
  color: "#b91c1c",
  cursor: "pointer",
};

const miniRemoveButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#374151",
  cursor: "pointer",
  fontSize: "18px",
  lineHeight: 1,
};

export default ResumePage;
