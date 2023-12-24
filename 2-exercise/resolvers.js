const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")
const jwt = require("jsonwebtoken")
const { GraphQLError } = require("graphql")
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()


const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre)
        return await Book.find({}).populate("author")

      if (args.author && !args.genre) {
        let books = await Book.find({}).populate("author")
        books = books.filter((book) => book.author.name === args.author)
        return books
      } else if (!args.author && args.genre) {
        let books = await Book.find({}).populate("author")
        books = books.filter((book) => book.genres.includes(args.genre))
        return books
      } else {
        let books = await Book.find({}).populate("author")
        books = books.filter(
          (b) => b.author.name === args.author && b.genres.includes(args.genre)
        )
        return books
      }
    },
    allAuthors: async (root, args) => {
      const authors = await Author.find({})
      return authors
    },
    me: (root, args, context) => {
      // console.log("context:", context)
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
      console.log('book:', book);
      pubsub.publish("BOOK_ADDED", { bookAdded: book.populate("author") })

      return book.populate("author")
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

    editUser: async (root, args) => {
      if (args.favoriteGenre) {
        const user = await User.findOneAndUpdate(
          { username: args.username },
          { favoriteGenre: args.favoriteGenre }
        )

        try {
          user.save()
          return user
        } catch (error) {
          throw new GraphQLError("user update unsuccessful", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          })
        }
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
