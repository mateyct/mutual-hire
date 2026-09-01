import { useState } from "react";
import {
  DegreeType,
  Education,
  Experience,
  ExperienceType,
  Resume as ResumeModel,
} from "shared";

type EducationDraft = {
  id: number;
  school: string;
  degree: string;
  degreeType: DegreeType;
  focus: string;
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
  description: string;
  type: ExperienceType;
  saved: boolean;
};

const createEmptyEducation = (id: number): EducationDraft => ({
  id,
  school: "",
  degree: "",
  degreeType: DegreeType.Bachelors,
  focus: "",
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
  description: "",
  type: ExperienceType.fullTime,
  saved: false,
});

const ResumePage = () => {
  const [personalSummary, setPersonalSummary] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [educationEntries, setEducationEntries] = useState<EducationDraft[]>(
    [],
  );
  const [experienceEntries, setExperienceEntries] = useState<ExperienceDraft[]>(
    [],
  );

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
    value: string | DegreeType,
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
    value: string | ExperienceType,
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const resume = new ResumeModel(null, personalSummary);

    educationEntries
      .filter((entry) => entry.saved)
      .forEach((entry) => {
        const education = new Education(
          entry.school,
          entry.degree,
          entry.degreeType,
          entry.focus,
          Number(entry.gpa || 0),
          new Date(entry.start),
          new Date(entry.end),
          entry.description,
        );
        resume.addEducation(education);
      });

    experienceEntries
      .filter((entry) => entry.saved)
      .forEach((entry) => {
        const experience = new Experience(
          entry.title,
          entry.company,
          new Date(entry.start),
          new Date(entry.end),
          entry.description,
          entry.type,
        );
        resume.addExperience(experience);
      });

    skills.forEach((skill) => resume.addSkill(skill));

    console.log("Resume data:", resume);
  };

  const unsavedEducation = educationEntries.filter((entry) => !entry.saved);
  const savedEducation = educationEntries.filter((entry) => entry.saved);
  const unsavedExperience = experienceEntries.filter((entry) => !entry.saved);
  const savedExperience = experienceEntries.filter((entry) => entry.saved);

  return (
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

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "24px" }}>
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
                  <span style={{ color: "#6b7280" }}>No skills added yet.</span>
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
                    <label style={labelStyle}>School</label>
                    <input
                      type="text"
                      value={entry.school}
                      onChange={(event) =>
                        updateEducationEntry(
                          entry.id,
                          "school",
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
                    <label style={labelStyle}>Degree type</label>
                    <select
                      value={entry.degreeType}
                      onChange={(event) =>
                        updateEducationEntry(
                          entry.id,
                          "degreeType",
                          event.target.value as DegreeType,
                        )
                      }
                      style={inputStyle}
                    >
                      {Object.values(DegreeType).map((degreeType) => (
                        <option key={degreeType} value={degreeType}>
                          {degreeType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={fieldRowStyle}>
                    <label style={labelStyle}>Focus</label>
                    <input
                      type="text"
                      value={entry.focus}
                      onChange={(event) =>
                        updateEducationEntry(
                          entry.id,
                          "focus",
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
                  <div>School: {entry.school || "N/A"}</div>
                  <div>Degree: {entry.degree || "N/A"}</div>
                  <div>Degree Type: {entry.degreeType || "N/A"}</div>
                  <div>Focus: {entry.focus || "N/A"}</div>
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
                          event.target.value as ExperienceType,
                        )
                      }
                      style={inputStyle}
                    >
                      {Object.values(ExperienceType).map((experienceType) => (
                        <option key={experienceType} value={experienceType}>
                          {experienceType}
                        </option>
                      ))}
                    </select>
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
                        onChange={(event) =>
                          updateExperienceEntry(
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
                  <div>Start: {entry.start || "N/A"}</div>
                  <div>End: {entry.end || "N/A"}</div>
                  <div>Description: {entry.description || "N/A"}</div>
                </div>
              ))}
            </div>
          </section>

          <button type="submit" style={primaryButtonStyle}>
            Save resume
          </button>
        </form>
      </div>
    </div>
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
