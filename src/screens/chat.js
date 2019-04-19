/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Redirect} from '@reach/router'
import {useUser} from '../context/user'

function Chat() {
  const {user, logout} = useUser()
  if (!user) {
    return <Redirect to="/login" />
  }
  return (
    <div>
      <button onClick={logout}>Logout</button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

export default Chat
