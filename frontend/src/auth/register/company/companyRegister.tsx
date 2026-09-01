import { CompanyUser } from "shared";

const CompanyRegister = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const company = new CompanyUser(
            String(formData.get("companyName") || ""),
            String(formData.get("password") || ""),
            String(formData.get("email") || ""),
            String(formData.get("description") || "")
        );

        console.log(company);
    };

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
