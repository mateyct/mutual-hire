
const Welcome = () => {

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px" }}>
                <h1 style={{ margin: 0 }}>Welcome to MutualHire</h1>
                <button type="button" style={{ padding: "10px 18px", fontSize: "16px", cursor: "pointer" }}>
                    Login
                </button>
            </header>

            <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "32px" }}>
                <button type="button" style={{ padding: "32px 56px", fontSize: "24px", cursor: "pointer" }}>
                    Applicants
                </button>
                <button type="button" style={{ padding: "32px 56px", fontSize: "24px", cursor: "pointer" }}>
                    Companies
                </button>
            </main>
        </div>
    );
};

export default Welcome;