import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { typeDefs as scalarTypeDefs, resolvers as scalarResolvers  } from 'graphql-scalars';
import typeDefs from '../../types/typedef';
//import { resolvers } from '../../resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';

const apolloServer = new ApolloServer({
  // schema: makeExecutableSchema({
  //   typeDefs: [
  //     //...typeDefs,
  //     ...scalarTypeDefs
  //   ],
  //   resolvers:[
  //     //...resolvers,
  //     ...scalarResolvers
  //   ]
  // }),
  typeDefs: [...scalarTypeDefs, typeDefs],
  resolvers: scalarResolvers,
  playground: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};