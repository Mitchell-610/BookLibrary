const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book] # Define your Book type accordingly
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getSingleUser(id: ID!): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(username: String, email: String, password: String!): Auth
    saveBook(bookId: ID!): User
    deleteBook(bookId: ID!): User
  }
`;

module.exports = { typeDefs };
