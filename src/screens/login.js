import React from 'react'
import {useUser} from '../context/user'
import {Redirect} from '@reach/router'

function Login() {
  const {user, loginWithGitHub, loginWithTwitter} = useUser()
  if (user) {
    return <Redirect to="/chat" />
  }
  return (
    <div>
      <button onClick={loginWithTwitter}>Login with Twitter</button>
      <button onClick={loginWithGitHub}>Login with GitHub</button>
    </div>
  )
}

export default Login
