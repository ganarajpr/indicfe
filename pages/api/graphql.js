import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { typeDefs as scalarTypeDefs, resolvers as scalarResolvers  } from 'graphql-scalars';
import typeDefs from '../../types/typedef';
import resolvers from '../../resolvers';
import connectDB from '../../middleware/mongodb';
const apolloServer = new ApolloServer({

  typeDefs: [...scalarTypeDefs, typeDefs],
  resolvers: [scalarResolvers, resolvers],
  playground: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startServer = apolloServer.start();

const handler = async (req, res) => {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};

export default connectDB(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};