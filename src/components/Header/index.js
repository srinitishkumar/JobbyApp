import {ImHome} from 'react-icons/im'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const formLogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar-container">
      <ul className="header-container">
        <li className="list-item">
          <div className="header-image-container">
            <Link className="link" to="/">
              <img alt="website logo" className="website-logo" src={formLogo} />
            </Link>
          </div>
        </li>
        <li className="list-item">
          <div className="home-jobs-container">
            <Link className="link" to="/">
              <h1 className="home-header">Home</h1>
            </Link>
            <Link className="link" to="/jobs">
              <h1 className="home-header">Jobs</h1>
            </Link>
          </div>
        </li>
        <li className="list-item">
          <div className="button-container">
            <Link className="link" to="/login">
              <button
                type="button"
                onClick={onClickLogOut}
                className="logout-button"
              >
                Logout
              </button>
            </Link>
          </div>
        </li>
      </ul>
      <ul className="mobile-images-container">
        <li className="list-item">
          <Link className="link" to="/">
            <div className="mobile-image-container">
              <img
                alt="website logo"
                className="mobile-website-logo"
                src={formLogo}
              />
            </div>
          </Link>
        </li>

        <li className="list-item">
          <div className="home-image-container">
            <Link className="link" to="/">
              <ImHome className="mobile-home-icon" />
            </Link>
            <Link className="link" to="/jobs">
              <BsBriefcaseFill className="briefCase-icon" />
            </Link>
            <Link className="link" to="/login">
              <button
                type="button"
                className="button-mobile"
                onClick={onClickLogOut}
              >
                <FiLogOut className="logout-icon" />
              </button>
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)