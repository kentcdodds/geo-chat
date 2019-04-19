/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link, Redirect} from '@reach/router'
import {useUser} from '../context/user'

function Home() {
  const {user} = useUser()
  if (user) {
    return <Redirect to="/chat" />
  }
  return (
    <div>
      Home
      <Link to="/login">Login</Link>
    </div>
  )
}

export default Home
