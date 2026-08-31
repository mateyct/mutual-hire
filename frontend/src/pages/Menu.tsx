import  './Menu.css'
import { slide as Menu} from 'react-burger-menu'


const SideMenu = () => {

return (
    <Menu>
      <a id="match" className="menu-item" href="/match">Match</a>
        <a id="account" className="menu-item" href="/about">Account</a>
        <a id="logout" className="menu-item" href="/">Log Out</a>
    </Menu>
)
}

export default SideMenu;