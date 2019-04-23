import React from 'react'
import isMatch from 'lodash/isMatch'
import firebase from 'firebase/app'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useDocument} from 'react-firebase-hooks/firestore'
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

function Authenticate(props) {
  const {initialising: initializing, user} = useAuthState(firebase.auth())
  const context = React.useMemo(() => {
    return {
      loading: initializing,
      user,
      loginWithTwitter,
      loginWithGitHub,
      logout,
    }
  }, [initializing, user])

  if (initializing || !user) {
    return <UserContext.Provider value={context} {...props} />
  }
  return <UserProvider authenticatedUser={user} {...props} />
}

function UserProvider(props) {
  // spelling is weird, so we'll fix it :)
  const {authenticatedUser} = props
  const {error, loading, value: userDoc} = useDocument(
    firebase
      .firestore()
      .collection('users')
      .doc(authenticatedUser.uid),
  )

  // update users collection with old/missing data
  React.useEffect(() => {
    if (!userDoc) {
      return
    }
    const userData = userDoc.data()
    const authenticatedUserData = {
      id: authenticatedUser.uid,
      displayName: authenticatedUser.displayName,
      email: authenticatedUser.email,
      photoURL: authenticatedUser.photoURL,
      providers: authenticatedUser.providerData.map(p => ({
        providerId: p.providerId,
        uid: p.uid,
      })),
    }
    if (!isMatch(userData, authenticatedUserData)) {
      userDoc.ref.set(authenticatedUserData)
    }
  }, [authenticatedUser, userDoc])

  const context = React.useMemo(() => {
    return {
      loading,
      user: userDoc ? userDoc.data() : null,
      error,
      loginWithTwitter,
      loginWithGitHub,
      logout,
    }
  }, [loading, userDoc, error])
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
  Authenticate as UserProvider,
  useUser,
  useUnauthenticatedRedirect,
  useAuthenticatedRedirect,
}
