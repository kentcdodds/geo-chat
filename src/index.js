/** @jsx jsx */
import './bootstrap'

import {jsx} from '@emotion/core'
import ReactDOM from 'react-dom'
import {Router} from '@reach/router'
import AppProviders from './context'
import {useUser} from './context/user'
import Home from './screens/home'
import Chat from './screens/chat'
import Login from './screens/login'
import About from './screens/about'

function Routes() {
  const {loading} = useUser()
  if (loading) {
    return 'loading ...'
  }
  return (
    <Router>
      <Home path="/" />
      <Chat path="/chat" />
      <Login path="/login" />
      <About path="/about" />
    </Router>
  )
}

function App() {
  return (
    <AppProviders>
      <Routes />
    </AppProviders>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
