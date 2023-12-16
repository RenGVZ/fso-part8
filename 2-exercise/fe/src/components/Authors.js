import { useQuery } from "@apollo/client"
import { GET_AUTHORS } from "../queries"
import EditBirthYear from "./EditBirthYear"

const Authors = () => {
  const {data, loading, error} = useQuery(GET_AUTHORS)

  if(error) return <div>Error</div>
  if(loading) return <div>Loading...</div>

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditBirthYear />
    </div>
  )
}

export default Authors
