// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [name, setName] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const previousKeyRef = React.useRef(key)

  React.useEffect(() => {
    const previousKey = previousKeyRef.current
    if (previousKey !== key) {
      window.localStorage.removeItem(previousKey)
    }
    previousKeyRef.current = key
    window.localStorage.setItem(key, serialize(name))
  }, [key, name, serialize])

  return [name, setName]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
