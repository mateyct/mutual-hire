import { CompanyUser } from "shared";
import { useUserInfoActions } from "../../../userInfo/userInfoHooks.js";
import { useNavigate } from "react-router-dom";

const CompanyRegister = () => {
    const { updateUserInfo } = useUserInfoActions();
    const nav = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const company = new CompanyUser(
        String(formData.get("companyName") || ""),
        String(formData.get("password") || ""),
        String(formData.get("email") || ""),
        String(formData.get("description") || ""),
      );

      console.log(company);

      const response = await fetch(
        "http://localhost:8000/api/auth/register/recruiter/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: company.companyName,
            email: company.email,
            first_name: company.companyName,
            last_name: company.companyName,
            password: company.password,
            description: null,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        company.userID = data["profile"]["id"];
        updateUserInfo(company, data["token"]);
        nav("/company/account");
      } else {
        console.log("SAD :(");
        console.log(data);
      }
    };;

    return (
        <div>
            <h1>Company Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="companyName">Company Name: </label>
                    <input id="companyName" name="companyName" type="text" required />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input id="password" name="password" type="password" required />
                </div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input id="email" name="email" type="email" required />
                </div>
                <div>
                    <label htmlFor="description">Description: </label>
                    <textarea id="description" name="description" required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default CompanyRegister
