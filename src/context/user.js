import React from 'react'

const UserContext = React.createContext()

function UserProvider(props) {
  const context = React.useMemo(() => {
    return {
      loading: false,
      user: {displayName: 'Kent C. Dodds'},
    }
  }, [])
  return <UserContext.Provider value={context} {...props} />
}

function useUser() {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error(
      `useUser must be used within a component that's rendered within the UserProvider`,
    )
  }
  return context
}

export {UserProvider, useUser}
