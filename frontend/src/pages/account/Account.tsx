import { useState } from "react";

type UserType = "ApplicantUser" | "CompanyUser";

const Account = ({ userType }: { userType: UserType }) => {
  const isApplicant = userType === "ApplicantUser";

  const [formData, setFormData] = useState({
    username: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    console.log("Account updated", {
      ...(isApplicant
        ? { username: formData.username }
        : { companyName: formData.companyName }),
      email: formData.email,
      password: formData.password,
      ...(isApplicant ? {} : { description: formData.description }),
    });

    setSaved(true);
  };

  const passwordMismatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: "20px",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: "2rem" }}>Account</h1>
        <p style={{ margin: "0 0 24px", color: "#475569" }}>
          {isApplicant
            ? "Update your applicant profile information below."
            : "Update your company profile information below."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
          {isApplicant ? (
            <div>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter a username"
                required
                style={inputStyle}
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="companyName"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              style={inputStyle}
            />
          </div>

          {!isApplicant && (
            <div>
              <label
                htmlFor="description"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell applicants about your company"
                required
                rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          )}

          {passwordMismatch && (
            <p style={{ margin: 0, color: "#dc2626", fontSize: "0.95rem" }}>
              Passwords do not match.
            </p>
          )}

          {saved && (
            <p style={{ margin: 0, color: "#15803d", fontSize: "0.95rem" }}>
              Changes saved successfully.
            </p>
          )}

          <button
            type="submit"
            style={{
              padding: "12px 18px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Save Changes
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
  background: "#48474a",
  borderRadius: "10px",
  boxSizing: "border-box",
};

export default Account;
