import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLEmail } from 'graphql-custom-types';
import { merge } from 'lodash';
import {
  type as Auth,
  resolvers as authResolvers
} from './auth';

export const Query = /* GraphQL */`
  scalar DateTime
  scalar Email

  type Query {
    _empty: Boolean
  }

  type Mutation {
    _empty: Boolean
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

export const resolvers = {
  DateTime: GraphQLDateTime
};

export const Schema = makeExecutableSchema({
  typeDefs: [ Query, Auth ],
  resolvers: merge(
    resolvers,
    authResolvers
  ),
});
