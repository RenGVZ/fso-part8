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
      genres
    }
  }
`

export const CREATE_BOOK = gql`
  mutation CREATE_BOOK(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
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