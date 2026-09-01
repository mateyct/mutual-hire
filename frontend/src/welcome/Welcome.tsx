import { Route, useNavigate } from "react-router-dom";


const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 32px",
        }}
      >
        <h1 style={{ margin: 0 }}>Welcome to MutualHire</h1>
        <button
          type="button"
          style={{
            padding: "10px 18px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </header>

      <main
        style={{
          flex: 1,
          display: "grid",
          placeContent: "center",
          justifyItems: "center",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          textAlign: "center",
        }}
      >
        <p>
          Welcome to MutualHire, where we match applicants to job opportunities.
          If you are new here, please register.
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          <button
            type="button"
            style={{
              padding: "32px 56px",
              fontSize: "24px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register/applicant")}
          >
            Applicants
          </button>
          <button
            type="button"
            style={{
              padding: "32px 56px",
              fontSize: "24px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register/company")}
          >
            Companies
          </button>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
