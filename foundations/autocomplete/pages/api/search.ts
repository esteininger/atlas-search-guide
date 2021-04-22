import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { ExtendedRequest } from '../../interfaces/server';
import middleware from '../../middleware/database';

const handler = nextConnect<ExtendedRequest, NextApiResponse>();
handler.use(middleware);

handler.get(async (req, res) => {
  
  const { query, path, fuzzy } = req.query;
  const { indexName, collection } = req.mongodb;
  
  const fuzzyOptions = fuzzy === "true" ? {
    "maxEdits": 2,
    "prefixLength": 3
  } : null

  try {
    const pipeline = [
      {
        "$search": {
          'index': indexName,
          "autocomplete": {
            "query": `${query}`,
            "path": `${path}`,
            "fuzzy": fuzzyOptions,
            "tokenOrder": "sequential"
          }
        }
      }
    ]

    let result = await collection.aggregate(pipeline).toArray();
    return res.send(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

export default handler;