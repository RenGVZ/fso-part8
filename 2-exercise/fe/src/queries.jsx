import { gql } from '@apollo/client'

export const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`

export const GET_BOOKS = gql`
  query GETBOOKS(
    $authorName: String
    $genre: String
  ) {
    allBooks(
      author: $authorName
      genre: $genre
    ) {
      title
      published
    }
  }
`

export const CREATE_BOOK = gql`
  mutation CREATE_BOOK(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author
      genres
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation EDIT_AUTHOR(
    $name: String!
    $born: Int!
  ) {
    editAuthor(
      name: $name
      setBornTo: $born
    ) {
      name
      born
      bookCount
      id
    }
  }
`

export const LOGIN = gql`
  mutation LOGIN(
    $username: String!
    $password: String!
  ) {
    login (
      username: $username
      password: $password
    ) {
      value
    }
  }
`