import { MongoClient, Db } from 'mongodb';
import nextConnect from 'next-connect';
import { ExtendedRequest } from '../interfaces/server';

async function database(req: any, res: any, next: any) {

  try {
    if (!global['mongodb'] || !global['mongodb'].client) {
      const client = new MongoClient(process.env.MDB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      if (!client.isConnected()) {
        await client.connect();
        console.log(`MongoDB client connected!`);
      }

      const db = client.db(process.env.DB_NAME);
      const collection = db.collection(process.env.COLLECTION_NAME);
      const indexName = process.env.INDEX_NAME;
      const indexField = process.env.INDEX_FIELD;
      global['mongodb'] = {
        client,
        db,
        collection,
        indexField,
        indexName
      }
    }

    req.mongodb = global['mongodb'];
  } catch (e) {
    return res.status(500).send({ message: `Unable to establish a connection to MongoDB. Error: ${e.message}`, });
  }

  return next();
}

const middleware = nextConnect<ExtendedRequest>();
middleware.use(database);

export default middleware;