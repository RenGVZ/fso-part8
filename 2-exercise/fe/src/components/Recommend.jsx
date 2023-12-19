import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { ME, GET_BOOKS } from "../queries"

const Recommend = () => {
  const { data: userData, error, loading } = useQuery(ME)
  const {
    data: booksData,
    error: booksError,
    loading: booksLoading,
  } = useQuery(GET_BOOKS)
  const [favoriteGenre, setFavoriteGenre] = useState("")
  const [recommendedBooks, setRecommendedBooks] = useState([])

  useEffect(() => {
    if (userData?.me) {
      const favorite = userData.me.favoriteGenre
      setFavoriteGenre(favorite)

      if (booksData?.allBooks) {
        const allBooks = booksData.allBooks
        const filtered = allBooks.filter((book) =>
          book.genres.includes(favoriteGenre)
        )
        setRecommendedBooks(filtered)
      }
    }
  }, [userData, booksData, favoriteGenre])

  if (error || booksError) return <div>error</div>
  if (loading || booksLoading) return <div>loading...</div>

  return (
    <>
      <h2>Recommendations</h2>

      <p>
        books in your favorite genre{" "}
        <span style={{ fontWeight: "bold" }}>{favoriteGenre}</span>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Recommend
