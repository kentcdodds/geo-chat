/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'
import {Redirect} from '@reach/router'
import {useUser} from '../context/user'

function Chat() {
  const {user, logout} = useUser()
  return (
    <div>
      <div css={{height: 120}}>
        <img
          css={{maxHeight: 80, maxWidth: 80, borderRadius: 10}}
          alt={user.displayName}
          src={user.photoURL}
        />
        <div>{user.displayName}</div>
      </div>
      <button onClick={logout}>Logout</button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <ChatMessages />
    </div>
  )
}

const geoPositionReducer = (state, action) => ({...state, ...action})

function useGeoLocation(positionOptions) {
  const [state, setState] = React.useReducer(geoPositionReducer, {
    position: null,
    loading: true,
    error: null,
  })
  React.useEffect(() => {
    setState({loading: true})

    function onPosition(position) {
      setState({position, loading: false, error: null})
    }
    function onError(error) {
      setState({position: null, loading: false, error})
    }

    navigator.geolocation.getCurrentPosition(
      onPosition,
      onError,
      positionOptions,
    )

    const listener = navigator.geolocation.watchPosition(
      onPosition,
      onError,
      positionOptions,
    )

    return () => navigator.geolocation.clearWatch(listener)
  }, [positionOptions])

  return state
}

const getRoomId = ({latitude, longitude}) =>
  `${(latitude * 10).toFixed()}_${(longitude * 10).toFixed()}`

function ChatMessages() {
  const {position, loading, error} = useGeoLocation()
  if (loading) {
    return '... calculating your room based on your location ...'
  }
  if (error) {
    console.error(error)
    return '... there was an error determining your location ...'
  }
  const roomId = getRoomId(position.coords)
  return <ChatMessagesWithRoomId roomId={roomId} />
}

function ChatMessagesWithRoomId({roomId}) {
  const {user} = useUser()
  const messagesRef = firebase
    .firestore()
    .collection('rooms')
    .doc(roomId)
    .collection('messages')
  const {error, loading, value: messagesSnapshot} = useCollection(
    messagesRef.orderBy('timestamp', 'desc').limit(20),
  )
  if (loading) {
    return '... loading room chats ...'
  }
  if (error) {
    console.error(error)
    return 'There was an error loading the room chats'
  }

  function handleSubmit(event) {
    event.preventDefault()
    const {message} = event.target.elements

    messagesRef.add({
      authorId: user.id,
      message: message.value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
  }

  return (
    <div>
      <div>
        {messagesSnapshot.docs.reverse().map(d => (
          <div key={d.id}>{d.data().message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message-input">Message</label>
        <input id="message-input" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

function ChatRedirect(props) {
  const {user} = useUser()
  if (!user) {
    return <Redirect to="/login" />
  }
  return <Chat {...props} />
}

export default ChatRedirect
