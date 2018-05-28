import { MongoClient } from 'mongodb';

export const prepare = o => {
  o.id = o._id.toString();
  delete o._id;
  return o;
}

export const dbName = 'accounting';

export const dbPromise = MongoClient.connect('mongodb://localhost')
  .then(client => client.db(dbName));
