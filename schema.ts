//schema.ts
export const typeDefs = `#graphql

type Restaurante {
  id: ID!
  name: String!
  address: String!
  phone: String!
  email: String!
  localtime: String!
  temperature: Int!
  time: String!
  capital: String
}

type Query {
  getRestaurants(city: String!): [Restaurante!]!
  getRestaurant(id: ID!): Restaurante
}

type Mutation {
  addRestaurant(name: String! address: String! email: String! phone: String!city: String! ): Restaurante
  deleteRestaurant(id: ID!): Boolean!
}
`;