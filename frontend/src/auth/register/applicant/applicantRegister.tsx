import { ApplicantUser } from "shared";

const ApplicantRegister = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
