import { useState } from "react"
import { ALL_PERSONS, EDIT_NUMBER } from "../queries"
import { useMutation } from "@apollo/client"

const PhoneForm = ({setError}) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const [changeNumber] = useMutation(EDIT_NUMBER, {
    refetchQueries: [ALL_PERSONS],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    changeNumber({ variables: { name, phone } })

    setName("")
    setPhone("")
  }

  return (
    <>
      <h2>Change Number</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <input
            value={name}
            name="name"
            onChange={({ target }) => setName(target.value)}
          />
        </div>

        <div>
          phone
          <input
            value={phone}
            name="phone"
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>

        <button type="submit">Change Number</button>
      </form>
    </>
  )
}

export default PhoneForm
