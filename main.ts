// main.ts
//Jorge sanchez lopez
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema.ts";
import { MongoClient } from "mongodb";
import { RestauranteModel } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("ExamenOrdinarioPracticar");
const ResturantsCollection =
  mongoDB.collection<RestauranteModel>("restaurante");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ ResturantsCollection }),
});

console.info(`Server ready at ${url}`);