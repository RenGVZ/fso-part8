const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { GraphQLError } = require("graphql")
const { v1: uuid } = require("uuid")
const jwt = require("jsonwebtoken")
const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")

const mongoose = require("mongoose")

require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI

console.log("connecting to ", MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message)
  })

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
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) return await Book.find({})

      if (args.author && !args.genre) {
        let books = await Book.find({}).populate("author")
        books = books.filter((book) => book.author.name === args.author)
        return books
      } else if (!args.author && args.genre) {
        let books = await Book.find({})
        books = books.filter((book) => book.genres.includes(args.genre))
        return books
      } else {
        let books = await Book.find({}).populate("author")
        books = books.filter(
          (b) => b.author.name === args.author && b.genres.includes(args.genre)
        )
        console.log('books:', books);
        return books
      }
    },
    allAuthors: async (root, args) => {
      const authors = await Author.find({})
      return authors
    },
    me: (root, args, context) => {
      console.log("context:", context)
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      let books = await Book.find({}).populate("author")
      const number = books.filter((b) => b.author.name === root.name).length
      return number
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const author = await Author.findOne({ name: args.author })
      let authorId = null
      if (!author) {
        try {
          const newAuthor = new Author({ name: args.author })
          await newAuthor.save()
          authorId = newAuthor._id
        } catch (error) {
          throw new GraphQLError("Saving new author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          })
        }
      } else {
        authorId = author._id
      }
      let book = new Book({ ...args, author: authorId })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }

      return book
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      if (args.setBornTo) {
        const updated = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo }
        )
        try {
          updated.save()
          return updated
        } catch (error) {
          throw new GraphQLError("Author age update failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          })
        }
      }
    },

    addAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      const author = new Author({ name: args.name, born: args.born })
      return author.save()
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        user.save()
        return user
      } catch (error) {
        throw new GraphQLError("unable to create new user", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong username or password", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const userToToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userToToken, process.env.JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
