import { useState, useEffect } from "react"
import { LOGIN } from "../queries"
import { useMutation } from "@apollo/client"

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
  }

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-app-token', token)
    }
  }, [result.data, setToken])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm
