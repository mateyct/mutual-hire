const Login = () => {
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    console.log("here");

    const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: username,
            password: password,
        })
    });
    const data = await response.json()
    console.log(data)
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

export default Login;