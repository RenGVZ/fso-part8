import { useQuery } from "@apollo/client"
import { GET_BOOKS } from "../queries"
import { useState, useEffect } from "react"

const Books = () => {
  const { data, loading, error } = useQuery(GET_BOOKS)
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState("all")

  useEffect(() => {
    if (data?.allBooks) {
      let filteredBooks = data.allBooks
      if (selectedGenre !== "all") {
        filteredBooks = data.allBooks.filter((book) => book.genres.includes(selectedGenre))
      }
      setBooks(filteredBooks)

      if(selectedGenre === "all") {
        const genreList = [...new Set(data.allBooks.flatMap((book) => book.genres))]
        setGenres([...genreList, "all"])
      }
    }
  }, [data, selectedGenre])

  if (error) return <div>Error</div>
  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre) => (
        <button
          key={genre}
          value={genre}
          onClick={({ target }) => setSelectedGenre(target.value)}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}

export default Books
