import { Routes, Route } from 'react-router-dom'
import './App.css'
import Welcome from "./welcome/Welcome.tsx"
import Login from "./auth/login/Login.tsx"
import ApplicantRegister from "./auth/register/applicant/applicantRegister.tsx"
import CompanyRegister from "./auth/register/company/companyRegister.tsx"


function App() {

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/applicant" element={<ApplicantRegister />} />
      <Route path="/register/company" element={<CompanyRegister />} />
    </Routes>
  )
}

export default App
