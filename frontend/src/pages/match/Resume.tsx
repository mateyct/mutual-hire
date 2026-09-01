import { Resume, ApplicantUser } from "shared";

const ResumeMatch = ({ applicant }: { applicant: ApplicantUser }) => {
const name = applicant.firstName + " " + applicant.lastName
const resume = applicant.resume

return (
    <div
        style={{
            backgroundColor: "white",
            width: "400px",
            height: "400px",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
        >
        <h2>{name}</h2>

        <p>Skills,etc</p>
    </div>
)
}
export default ResumeMatch