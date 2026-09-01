import { ApplicantUser, CompanyUser } from "shared";
import { useUserInfoActions } from "../../userInfo/userInfoHooks.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { updateUserInfo } = useUserInfoActions();
  const nav = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    const response = await fetch("http://localhost:8000/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
<<<<<<< Updated upstream
      const profile = data["profile"];

      if (profile["user_type"] === "applicant") {
        const currUser = new ApplicantUser(
          profile["user"]["first_name"],
          profile["user"]["last_name"],
          username,
          password,
          profile["user"]["email"],
        );
        updateUserInfo(currUser, data["token"]);
        nav("/applicant/resume");
      } else {
        const currUser = new CompanyUser(
          username,
          password,
          profile["user"]["email"],
          profile["description"],
        );
        updateUserInfo(currUser, data["token"]);
        nav("/company/jobs");
      }
=======
        console.log(data)
        if (data["profile"]["user_type"] == "applicant") {
            const currUser = new ApplicantUser(
              data["profile"]["user"]["first_name"],
              data["profile"]["user"]["last_name"],
              username,
              password,
              data["profile"]["user"]["email"],
            );
            currUser.userID = data["profile"]["user"]["id"];
            updateUserInfo(currUser, data["token"]);
            nav("/applicant/resume");
        } else {
            const currUser = new CompanyUser(
              username,
              password,
              data["profile"]["user"]["email"],
              data["profile"]["description"],
            );
            updateUserInfo(currUser, data["token"]);
            nav("/company/jobs");
        }
>>>>>>> Stashed changes
    } else {
      console.log("error");
      console.log(data);
    }
<<<<<<< Updated upstream
  };

  return (
    <div style={pageShellStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Login</h1>
        <p style={subtitleStyle}>Welcome back. Sign in to continue.</p>

        <form onSubmit={handleLogin} style={formStyle}>
          <div>
            <label htmlFor="username" style={labelStyle}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Enter your username"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>

          <button type="submit" style={primaryButtonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const pageShellStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px 12px",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "520px",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  padding: "28px 24px",
};

const headingStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: "2rem",
  color: "#0f172a",
};

const subtitleStyle: React.CSSProperties = {
  margin: "0 0 24px",
  color: "#475569",
  fontSize: "0.98rem",
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: "18px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
  color: "#1e293b",
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

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
};
=======
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">User/Company Name: </label>
                    <input id="username" name="username" type="text" />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input id="password" name="password" type="password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
>>>>>>> Stashed changes

export default Login;
