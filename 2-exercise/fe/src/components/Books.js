import { useQuery } from "@apollo/client"
import { GET_BOOKS } from "../queries"
import { useState, useEffect } from "react"

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState("")
  const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
    variables: selectedGenre === "" ? {} : { genre: selectedGenre },
  })
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])

  useEffect(() => {
    if (data?.allBooks) {
      setBooks(data.allBooks)

      if (selectedGenre === "") {
        const genreList = [
          ...new Set(data.allBooks.flatMap((book) => book.genres)),
        ]
        setGenres([...genreList, ""])
      }
    }
  }, [data, selectedGenre])

  const handleGenreChange = (newGenre) => {
    setSelectedGenre(newGenre)
    refetch({ selectedGenre: newGenre })
  }

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
          onClick={({ target }) => handleGenreChange(target.value)}
        >
          {genre === "" ? "all" : genre}
        </button>
      ))}
    </div>
  )
}

export default Books
