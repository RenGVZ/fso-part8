import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { EDIT_AUTHOR, GET_AUTHORS } from "../queries"

const EditBirthYear = () => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const { data } = useQuery(GET_AUTHORS)

  const [changeBirth] = useMutation(EDIT_AUTHOR)

  const handleSubmit = (e) => {
    e.preventDefault()
    if(name && name !== '') {
      changeBirth({ variables: { name, born: parseInt(born) } })
      setBorn("")
    } else {
      return
    }
  }

  return (
    <>
      <div>Edit BirthYear</div>
      <form onSubmit={handleSubmit}>
        <div>
          Name
          <select defaultValue="" onChange={(e) => setName(e.target.value)}>
            <option value=""></option>
            {data &&
              data?.allAuthors.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          Born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </>
  )
}

export default EditBirthYear
