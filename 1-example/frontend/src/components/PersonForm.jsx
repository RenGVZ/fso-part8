import { useMutation } from "@apollo/client"
import { useState } from "react"
import { ALL_PERSONS, CREATE_PERSON } from "../queries"

const PersonForm = () => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [createPerson, { data, loading, error }] = useMutation(CREATE_PERSON, {
    refetchQueries: [
      ALL_PERSONS
    ]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPerson({ variables: { name, phone, street, city } })

    setName("")
    setPhone("")
    setStreet("")
    setCity("")
  }

  return (
    <>
      <div>Create new person</div>
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
