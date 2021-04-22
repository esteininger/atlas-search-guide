
import { Db, MongoClient, Collection } from "mongodb";
import { NextApiRequest } from "next";


export interface ExtendedRequest extends NextApiRequest{
  mongodb: { 
    db: Db
    client: MongoClient
    collection: Collection
    indexName: string
    indexField: string
  }
}