import { useState } from "react";
import SideMenu from "../pages/Menu.js";
import { useUserInfo } from "../userInfo/userInfoHooks.js";
import "./Resume.css";

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

        if (
          entry.type !== "full_time" &&
          entry.type !== "part_time" &&
          entry.type !== "internship"
        ) {
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
      <div className="resume-page">
        <div className="resume-shell">
          <h1 className="resume-heading">Create your resume</h1>
          <p className="resume-subtitle">
            Add your personal summary, experience, education, and skills.
          </p>

          <form onSubmit={handleSubmit} className="resume-form">
            <section className="resume-section">
              <h2 className="resume-section-heading">Personal summary</h2>
              <textarea
                value={personalSummary}
                onChange={(event) => setPersonalSummary(event.target.value)}
                placeholder="Describe yourself and your career goals"
                rows={5}
                required
                className="resume-textarea"
              />
            </section>

            <section className="resume-section">
              <h2 className="resume-section-heading">Skills</h2>
              <div className="resume-section">
                <div className="resume-skill-list">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="resume-skill-tag"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          className="resume-skill-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="resume-skill-empty">
                      No skills added yet.
                    </span>
                  )}
                </div>

                <div className="resume-skill-input-row">
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
                    className="resume-input resume-skill-input"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="resume-button-secondary"
                  >
                    Add skill
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="resume-section-header">
                <h2 className="resume-section-heading">Education</h2>
                <button
                  type="button"
                  onClick={addEducationEntry}
                  className="resume-button-secondary"
                >
                  + Add education
                </button>
              </div>

              <div style={{ display: "grid", gap: "18px" }}>
                {unsavedEducation.map((entry) => (
                  <div key={entry.id} className="resume-draft-card">
                    <div className="resume-field-row">
                      <label className="resume-label">
                        School / university
                      </label>
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
                        className="resume-input"
                      />
                    </div>

                    <div className="resume-field-row">
                      <label className="resume-label">Degree</label>
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
                        className="resume-input"
                      />
                    </div>

                    <div className="resume-field-row">
                      <label className="resume-label">Major</label>
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
                        className="resume-input"
                      />
                    </div>

                    <div className="resume-field-row">
                      <label className="resume-label">GPA</label>
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
                        className="resume-input"
                      />
                    </div>

                    <div className="resume-two-col">
                      <div className="resume-field-row">
                        <label className="resume-label">Start date</label>
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
                          className="resume-input"
                        />
                      </div>
                      <div className="resume-field-row">
                        <label className="resume-label">End date</label>
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
                          className="resume-input"
                        />
                      </div>
                    </div>

                    <div className="resume-field-row">
                      <label className="resume-label">Description</label>
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
                        className="resume-textarea"
                      />
                    </div>

                    <div className="resume-actions">
                      <button
                        type="button"
                        onClick={() => saveEducationEntry(entry.id)}
                        className="resume-button-primary"
                      >
                        Save education
                      </button>
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(entry.id)}
                        className="resume-button-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {savedEducation.map((entry) => (
                  <div key={entry.id} className="resume-saved-card">
                    <div className="resume-card-header">
                      <strong>Education</strong>
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(entry.id)}
                        className="resume-mini-button"
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
              <div className="resume-section-header">
                <h2 className="resume-section-heading">Experience</h2>
                <button
                  type="button"
                  onClick={addExperienceEntry}
                  className="resume-button-secondary"
                >
                  + Add experience
                </button>
              </div>

              <div style={{ display: "grid", gap: "18px" }}>
                {unsavedExperience.map((entry) => (
                  <div key={entry.id} className="resume-draft-card">
                    <div className="resume-field-row">
                      <label className="resume-label">Title</label>
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
                        className="resume-input"
                      />
                    </div>

                    <div className="resume-field-row">
                      <label className="resume-label">Company</label>
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
                        className="resume-input"
                      />
                    </div>

                    <div className="resume-field-row">
                      <label className="resume-label">Type</label>
                      <select
                        value={entry.type}
                        onChange={(event) =>
                          updateExperienceEntry(
                            entry.id,
                            "type",
                            event.target.value as ExperienceTypeValue,
                          )
                        }
                        className="resume-select"
                      >
                        <option value="full_time">full_time</option>
                        <option value="part_time">part_time</option>
                        <option value="internship">internship</option>
                      </select>
                    </div>

                    <div className="resume-field-row">
                      <label className="resume-label">
                        Currently employed here
                      </label>
                      <label className="resume-checkbox-row">
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

                    <div className="resume-two-col">
                      <div className="resume-field-row">
                        <label className="resume-label">Start date</label>
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
                          className="resume-input"
                        />
                      </div>
                      <div className="resume-field-row">
                        <label className="resume-label">End date</label>
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
                          className={`resume-input ${entry.currentJob ? "resume-disabled-input" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="resume-field-row">
                      <label className="resume-label">Description</label>
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
                        className="resume-textarea"
                      />
                    </div>

                    <div className="resume-actions">
                      <button
                        type="button"
                        onClick={() => saveExperienceEntry(entry.id)}
                        className="resume-button-primary"
                      >
                        Save experience
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExperienceEntry(entry.id)}
                        className="resume-button-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {savedExperience.map((entry) => (
                  <div key={entry.id} className="resume-saved-card">
                    <div className="resume-card-header">
                      <strong>Experience</strong>
                      <button
                        type="button"
                        onClick={() => removeExperienceEntry(entry.id)}
                        className="resume-mini-button"
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
              <div className="resume-status-error">{submitError}</div>
            ) : null}
            {submitSuccess ? (
              <div className="resume-status-success">{submitSuccess}</div>
            ) : null}

            <button type="submit" className="resume-button-primary">
              Save resume
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResumePage;
