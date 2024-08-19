import Cookies from 'js-cookie'

import {Component} from 'react'

import {Redirect} from 'react-router-dom'
import './index.css'

const formLogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'

class LoginForm extends Component {
  state = {username: '', password: '', showErro: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErro: true, errorMsg})
  }

  render() {
    const {username, password, showErro, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="app-container">
        <form className="responsive-container" onSubmit={this.onSubmitForm}>
          <div className="logo-container">
            <img alt="website logo" className="website-logo" src={formLogo} />
          </div>
          <div className="name-input-container">
            <label htmlFor="nameInput" className="label">
              USERNAME
            </label>
            <input
              id="nameInput"
              className="input-element"
              type="text"
              placeholder="Username"
              onChange={this.onChangeUsername}
              value={username}
            />
          </div>
          <div className="name-input-container">
            <label htmlFor="passwordInput" className="label">
              PASSWORD
            </label>
            <input
              type="password"
              className="input-element"
              id="passwordInput"
              placeholder="Password"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>

          {showErro && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default LoginForm