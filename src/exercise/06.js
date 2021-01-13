// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function FallbackComponent({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: pokemonName ? PENDING : IDLE,
    pokemon: null,
    error: null,
  })
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: PENDING})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({
          status: RESOLVED,
          pokemon: pokemonData,
        })
      })
      .catch(error => {
        setState({status: REJECTED, error: error})
      })
  }, [pokemonName])

  switch (status) {
    case IDLE:
      return <>Submit a pokemon</>
    case PENDING:
      return <PokemonInfoFallback name={pokemonName} />
    case RESOLVED:
      return <PokemonDataView pokemon={pokemon} />
    case REJECTED:
      throw error
    default:
      throw new Error('Unknown component state')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={FallbackComponent}
          onReset={handleReset}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
