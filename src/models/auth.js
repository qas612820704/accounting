import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { dbPromise, prepare } from '../db';

const authPromise = dbPromise.then(db => db.collection('auths'));

const checkValidPwd = (auth, password) => {
  const passwordHashed = createHash('sha256').update(password).digest('hex');
  return auth.password !== passwordHashed;
}

export const type = /* GraphQL */`
  type Auth {
    id: String
    name: String
    email: Email
    token: String
  }

  extend type Query {
    me(token: String): Auth
  }

  extend type Mutation {
    login(
      email: Email!
      password: String!
    ): Auth

    sign(
      name: String!
      email: Email!
      password: String!
    ): Auth
  }
`;

const login = async (root, { email, password }) => {
  const Auth = await authPromise;
  const me = await Auth.findOne({ email });

  if (me === null) throw `user: ${email} not founded`;

  if (checkValidPwd(me, password)) throw 'Wrong password';

  const preparedMe = prepare(me);

  preparedMe.token = jwt.sign(preparedMe, '!!!!SECRET!!!!');

  return preparedMe;
};

export const resolvers = {
  Query: {
    me: (root, { token }) => {
      return jwt.verify(token, '!!!!SECRET!!!!');
    },
  },
  Mutation: {
    login,

    sign: async (root, { name, email, password }) => {
      const Auth = await authPromise;

      if (await Auth.findOne({ email })) throw 'user already exists';

      const auth = await Auth.insertOne({
        name,
        email,
        password: createHash('sha256').update(password).digest('hex'),
      });

      return prepare(auth.ops[0]);
    }
  }
}
