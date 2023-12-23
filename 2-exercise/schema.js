const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int
    ): Author

    addAuthor(
      name: String!
      born: Int
      bookCount: Int
    ) : Author

    createUser(
      username: String!
      favoriteGenre: String!
    ) : User

    login(
      username: String!
      password: String!
    ) : Token

    editUser(
      username: String!
      favoriteGenre: String!
    ) : User
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs