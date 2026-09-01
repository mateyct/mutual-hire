import { Routes, Route } from 'react-router-dom'
import './App.css'
import Welcome from "./welcome/Welcome.tsx"
import Login from "./auth/login/Login.tsx"
import ApplicantRegister from "./auth/register/applicant/applicantRegister.tsx"
import CompanyRegister from "./auth/register/company/companyRegister.tsx"
import Account from "./pages/account/Account.tsx"
import { useUserInfo } from "./userInfo/userInfoHooks.ts"


function App() {
  const { currentUserType,
        username,
        auth } = useUserInfo()

  const isAuth = () => {
    return !!currentUserType && !!username && !!auth;
  }

  if (isAuth()) {
    if (currentUserType === "company") {
      // all company pages
      return (
        <Routes>
          <Route path="/company/account" element={<Account />} />
        </Routes>
      )
    } else {
      return (
        // all applicant pages
        <Routes>
          <Route path="/applicant/account" element={<Account />} />
        </Routes>
      )
    }
  } else {
    return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/applicant" element={<ApplicantRegister />} />
      <Route path="/register/company" element={<CompanyRegister />} />
    </Routes>
  )
  }
}

export default App
