import { useQuery } from "@apollo/client"
import { ALL_PERSONS, FIND_PERSON } from "./queries"
import { useState } from "react"
import { useApolloClient } from "@apollo/client"
import PersonForm from "./components/PersonForm"
import PhoneForm from "./components/PhoneForm"
import Notify from "./components/Notify"
import LoginForm from "./components/LoginForm"

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const { loading, data, error } = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  if (loading) return <>Loading content...</>
  if (error) return <>Error!</>

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 8000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>Logout</button>
      <Persons persons={data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </>
  )
}

const Persons = ({ persons }) => {
  const [nameToSearch, setNameToSearch] = useState(null)
  const { data } = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  })

  if (nameToSearch && data) {
    return (
      <Person person={data.findPerson} onClose={() => setNameToSearch(null)} />
    )
  }
  return (
    <div>
      <h2>Persons</h2>
      {persons.map((person) => (
        <div key={person.name}>
          {person.name} {person.phone}
          <button onClick={() => setNameToSearch(person.name)}>
            show address
          </button>
        </div>
      ))}
    </div>
  )
}

const Person = ({ person, onClose }) => {
  return (
    <>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </>
  )
}

export default App
