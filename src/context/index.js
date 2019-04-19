import React from 'react'
import {UserProvider} from './user'

function AppProviders({children}) {
  return <UserProvider>{children}</UserProvider>
}

export default AppProviders
