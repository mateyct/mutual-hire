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

    console.log("here");

    // FIGURE OUT RESPONSE AND HOW TO USE TO NAV

    const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: username,
            password: password,
        })
    });
    const data = await response.json();
    if (response.ok) {
        console.log(data)
        if (data["profile"]["user_type"] == "applicant") {
            const currUser = new ApplicantUser(
              data["profile"]["user"]["first_name"],
              data["profile"]["user"]["last_name"],
              username,
              password,
              data["profile"]["user"]["email"],
            );
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
    } else {
        console.log("error");
        console.log(data);
    }
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