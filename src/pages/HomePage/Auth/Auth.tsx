import React from 'react'
import Login from './Login/Login'
import { useAuth } from '../../../context/AuthContext'
import Signup from './Signup/Signup'

function Auth() {
  const {isLoginPageInTheWindow} = useAuth()
  return (
    <div className=''>
      {
        isLoginPageInTheWindow
        ?
        (
          <Login/>
        )
        :
        (
          <Signup/>
        )

      }
    </div>
  )
}

export default Auth
