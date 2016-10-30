import React, { Component } from 'react'
import LoginForm from './LoginForm'
import './Login.scss'

class Login extends Component {
  constructor (props) {
    super(props)
    this.formSubmit = this.formSubmit.bind(this)
  }

  formSubmit (values) {
    return this.props.userLogin(values)
  }

  render () {
    return (
      <div className='row login'>
        <div className='col-sx-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3'>
          <LoginForm onSubmit={this.formSubmit} />
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  userLogin   : React.PropTypes.func.isRequired
}

export default Login
