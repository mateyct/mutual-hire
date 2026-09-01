import  './Menu.css'
import { slide as Menu} from 'react-burger-menu'


const SideMenu = ({ userType }: { userType: string }) => {

return (
    <Menu>
      {userType === "CompanyUser" && [
        <a key="my-jobs" className="menu-item" href="/my-jobs">My Jobs</a>,
        <a key="hire-ready" className="menu-item" href="/hire-ready">Hire Ready</a>
      ]}
      {userType === "ApplicantUser" && [
          <a className="menu-item" href="/resume">Resume</a>,
          <a className="menu-item" href="/api/matching/jobs">Match</a>,
          <a className="menu-item" href="/job-interests">Job Interests</a>,
      ]}
      
      <a id="account" className="menu-item" href="/account">Account</a>
      <a id="logout" className="menu-item" href="/">Log Out</a>
    </Menu>
)
}

export default SideMenu;