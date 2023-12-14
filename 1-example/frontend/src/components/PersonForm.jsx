import { useMutation } from "@apollo/client"
import { useState } from "react"
import { ALL_PERSONS, CREATE_PERSON } from "../queries"

const PersonForm = ({ setError }) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n")
      setError(messages)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPerson({
      variables: {
        name,
        phone: phone.length > 0 ? phone : undefined,
        street,
        city,
      },
    })

    setName("")
    setPhone("")
    setStreet("")
    setCity("")
  }

  return (
    <>
      <h2>Create new person</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          name="name"
          onChange={({ target }) => setName(target.value)}
          placeholder="Name"
        />
        <input
          value={phone}
          name="phone"
          onChange={({ target }) => setPhone(target.value)}
          placeholder="Phone"
        />
        <input
          value={street}
          name="street"
          onChange={({ target }) => setStreet(target.value)}
          placeholder="Street"
        />
        <input
          value={city}
          name="city"
          onChange={({ target }) => setCity(target.value)}
          placeholder="City"
        />
        <button type="submit">Add Person</button>
      </form>
    </>
  )
}

export default PersonForm
