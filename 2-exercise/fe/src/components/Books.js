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
      setBooks(data.allBooks)

      const genreList = [
        ...new Set(data.allBooks.flatMap((book) => book.genres)),
      ]
      setGenres([...genreList, "all"])
    }
  }, [data])

  // useEffect(() => {
  //   // console.log("selectedGenre:", selectedGenre)
  //   if(selectedGenre === "all") {
  //     console.log('all is selected');
  //   } else {
  //     console.log('inside filter');
  //     const filteredBooks = books.filter(book => book.genres.includes(selectedGenre) ? true : false)
  //     console.log("filteredBooks:", filteredBooks)
  //     setBooks(filteredBooks)
  //   }
  // }, [selectedGenre])

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
              <td>{a.author}</td>
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
