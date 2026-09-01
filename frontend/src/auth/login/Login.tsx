const Login = () => {
    return (
        <div>
            <h1>Login</h1>
            <form>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input id="username" name="username" type="text" />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input id="password" name="password" type="password" />
                </div>
                <button type="button">Login</button>
            </form>
        </div>
    );
}

export default Login;