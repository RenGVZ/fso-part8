import { useQuery } from "@apollo/client"
import { ALL_PERSONS, FIND_PERSON } from "./queries"
import { useState } from "react"
import PersonForm from "./components/PersonForm"
import PhoneForm from './components/PhoneForm'
import Notify from "./components/Notify"

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const { loading, data, error } = useQuery(ALL_PERSONS)

  if (loading) return <>Loading content...</>
  if (error) return <>Error!</>

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 8000)
  }

  return (
    <>
      <Notify errorMessage={errorMessage} />
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
