import React from 'react'
import firebase from 'firebase/app'
import {useAuthState} from 'react-firebase-hooks/auth'
import {navigate} from '@reach/router'

function loginWithTwitter() {
  const provider = new firebase.auth.TwitterAuthProvider()
  firebase.auth().signInWithPopup(provider)
}

function loginWithGitHub() {
  const provider = new firebase.auth.GithubAuthProvider()
  firebase.auth().signInWithPopup(provider)
}

function logout() {
  firebase.auth().signOut()
}

const UserContext = React.createContext()

function UserProvider(props) {
  const {initialising, user} = useAuthState(firebase.auth())
  const context = React.useMemo(() => {
    return {
      // spelling is weird, so we'll fix it :)
      initializing: initialising,
      user,
      loginWithTwitter,
      loginWithGitHub,
      logout,
    }
  }, [initialising, user])
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

function useAuthenticatedRedirect(destination = '/chat') {
  const {user} = useUser()
  if (user) {
    navigate(destination)
  }
}

function useUnauthenticatedRedirect(destination = '/login') {
  const {user} = useUser()
  if (user) {
    navigate(destination)
  }
}

export {
  UserProvider,
  useUser,
  useUnauthenticatedRedirect,
  useAuthenticatedRedirect,
}
