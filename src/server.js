import express from 'express';
import graphqlHttp from 'express-graphql';
import { Schema } from './models';

const app = express();

app.use('/graphql', graphqlHttp({
  schema: Schema,
  graphiql: true
}));

app.listen(3000, () => console.log('Application listen on *:3000'));

export default app;
