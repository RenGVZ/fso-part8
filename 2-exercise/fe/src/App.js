import { Link, Routes, Route } from "react-router-dom"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { useState } from "react"

const linkStyle = {
  background: 'grey',
  color: 'white',
  padding: '4px 6px',
  margin: '0px 4px',
  textDecoration: 'none',
  borderRadius: '4px'
}

const App = () => {
  const [token, setToken] = useState(null)
  
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
      </div>

      <Routes>
        <Route path="/" element={<Authors />} />

        <Route path="/books" element={<Books />} />

        <Route path="/add" element={<NewBook />} />
      </Routes>
    </div>
  )
}

export default App
