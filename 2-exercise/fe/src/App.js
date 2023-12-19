import { Link, Routes, Route } from "react-router-dom"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { useState } from "react"
import LoginForm from "./components/LoginForm"
import Recommend from "./components/Recommend"
import { useApolloClient } from "@apollo/client"

const linkStyle = {
  background: "grey",
  color: "white",
  padding: "4px 6px",
  margin: "0px 4px",
  textDecoration: "none",
  borderRadius: "4px",
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("library-app-token"))
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

  return (
    <div>
      <div style={{ margin: "20px 0px" }}>
        <Link style={linkStyle} to="/">
          authors
        </Link>
        <Link style={linkStyle} to="/books">
          books
        </Link>
        {token && (
          <>
            <Link style={linkStyle} to="/add">
              add book
            </Link>

            <Link style={linkStyle} to="/recommend">
              recommend
            </Link>
          </>
        )}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <Link style={linkStyle} to="/login">
            login
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Authors setError={notify} />} />

        <Route path="/books" element={<Books />} />

        <Route
          path="/add"
          element={
            !token ? (
              <LoginForm
                errorMessage={errorMessage}
                setToken={setToken}
                setError={notify}
              />
            ) : (
              <NewBook setError={notify} />
            )
          }
        />

        <Route
          path="/login"
          element={
            <LoginForm
              errorMessage={errorMessage}
              setToken={setToken}
              setError={notify}
            />
          }
        ></Route>

        <Route
          path="recommend"
          element={
            !token ? (
              <LoginForm
                errorMessage={errorMessage}
                setToken={setToken}
                setError={notify}
              />
            ) : (
              <Recommend />
            )
          }
        ></Route>
      </Routes>
    </div>
  )
}

export default App
