import { useQuery } from "@apollo/client"
import { ALL_PERSONS, FIND_PERSON } from "./queries"
import { useState } from "react"
import PersonForm from "./components/PersonForm"

const App = () => {
  const { loading, error, data } = useQuery(ALL_PERSONS)

  if (loading) return <>Loading content...</>
  if (error) return <>Error!</>

  return (
    <>
      <Persons persons={data.allPersons} />
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

      <PersonForm />
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
