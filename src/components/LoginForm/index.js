import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isError: false,
    errorMsg: '',
  }

  onChangeUserInput = event => {
    this.setState({username: event.target.value})
  }

  onChangePasswordInput = event => {
    this.setState({password: event.target.value})
  }

  renderSuccessResponse = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
    this.setState({username: '', password: '', errorMsg: '', isError: false})
  }

  renderFailureResponse = errMsg => {
    this.setState({isError: true, errorMsg: errMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.renderSuccessResponse(data.jwt_token)
    } else {
      this.renderFailureResponse(data.error_msg)
    }
  }

  renderLoginForm = () => {
    const {username, password, isError, errorMsg} = this.state

    return (
      <form className="login-form-container" onSubmit={this.onSubmitForm}>
        <div className="form-logo-container">
          <img
            src="https://res.cloudinary.com/ths-company/image/upload/v1680116030/Group_1_chgt0g.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="logo-heading">Insta Share</h1>
        </div>
        <label className="label-title" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          className="input"
          id="username"
          placeholder="USERNAME"
          value={username}
          onChange={this.onChangeUserInput}
        />
        <label className="label-title" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          className="input"
          id="password"
          placeholder="PASSWORD"
          value={password}
          onChange={this.onChangePasswordInput}
        />
        {isError ? <p className="errorMessage">{errorMsg}</p> : ''}
        <button className="button" type="submit">
          Login
        </button>
      </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/ths-company/image/upload/v1680113819/OBJECTS_quzbcc.png"
          alt="websiteLogo"
          className="loginImg"
        />
        {this.renderLoginForm()}
      </div>
    )
  }
}

export default LoginForm
