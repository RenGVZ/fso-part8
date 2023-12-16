import { Link, Routes, Route } from "react-router-dom"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { useState } from "react"
import LoginForm from "./components/LoginForm"
import { useApolloClient } from "@apollo/client"
import Notify from "./components/Notify"

const linkStyle = {
  background: "grey",
  color: "white",
  padding: "4px 6px",
  margin: "0px 4px",
  textDecoration: "none",
  borderRadius: "4px",
}

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 8000)
  }

  if (!token) return (
    <>
      <Notify errorMessage={errorMessage} />
      <LoginForm setToken={setToken} setError={notify} />
    </>
  )

  return (
    <div>
      <div style={{ margin: "20px 0px" }}>
        <Link style={linkStyle} to="/">
          authors
        </Link>
        <Link style={linkStyle} to="/books">
          books
        </Link>
        <Link style={linkStyle} to="/add">
          add book
        </Link>
        <button onClick={logout}>logout</button>
      </div>

      <Routes>
        <Route path="/" element={<Authors setError={notify} />} />

        <Route path="/books" element={<Books />} />

        <Route path="/add" element={<NewBook setError={notify} />} />
      </Routes>
    </div>
  )
}

export default App
