import { ApplicantUser } from "shared";
import { useUserInfoActions } from "../../../userInfo/userInfoHooks.js";
import { useNavigate } from "react-router-dom";

const ApplicantRegister = () => {
    const { updateUserInfo } = useUserInfoActions();
    const nav = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const applicant = new ApplicantUser(
            String(formData.get("firstName") || ""),
            String(formData.get("lastName") || ""),
            String(formData.get("username") || ""),
            String(formData.get("password") || ""),
            String(formData.get("email") || "")
        );

        console.log(applicant);

        const response = await fetch(
          "http://localhost:8000/api/auth/register/applicant/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: applicant.username,
              email: applicant.email,
              first_name: applicant.firstName,
              last_name: applicant.lastName,
              password: applicant.password,
              description: null
            }),
          },
        );
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            applicant.userID = data["profile"]["id"];
            updateUserInfo(applicant, data["token"]);
            nav("/applicant/account");
        } else {
            console.log("SAD :(")
            console.log(data)
        }
    };

    return (
        <div>
            <h1>Applicant Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">First Name: </label>
                    <input id="firstName" name="firstName" type="text" required />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name: </label>
                    <input id="lastName" name="lastName" type="text" required />
                </div>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input id="username" name="username" type="text" required />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input id="password" name="password" type="password" required />
                </div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input id="email" name="email" type="email" required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default ApplicantRegister;
