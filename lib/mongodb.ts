import { MongoClient, Db } from "mongodb";

/*
  MongoDB connection string stored in .env

  Example:
  DB_URI=mongodb+srv://username:password@cluster.mongodb.net/
*/

const uri = process.env.DB_URI;

if (!uri) {
  throw new Error(
    "DB_URI is missing. Add your MongoDB connection string to the .env file."
  );
}

/*
  During development, Next.js can reload files many times.

  Without caching the MongoClient, every reload could create
  another connection to MongoDB.

  We store the client globally so the same connection can be reused.
*/

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

/*
  Use an existing MongoClient if one already exists.
  Otherwise create a new one.
*/

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri);

/*
  In development, save the MongoClient globally.
*/

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

/*
  Return the SimpleDice database.

  Other files can simply call:

  const db = await getDatabase();
*/

export async function getDatabase(): Promise<Db> {
  await client.connect();

  return client.db("db");
}