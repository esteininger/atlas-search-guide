import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { ExtendedRequest } from '../../../interfaces/server';
import middleware from '../../../middleware/database';

const handler = nextConnect<ExtendedRequest, NextApiResponse>();
handler.use(middleware);

handler.get(async (req, res) => {

  const { id } = req.query;
  const { collection } = req.mongodb;

  try {
    let result = await collection.findOne({ "_id": parseInt(id as string) });
    return res.send(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

export default handler;