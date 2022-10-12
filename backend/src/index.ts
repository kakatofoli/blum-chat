import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import https from 'https';
import fs from 'fs';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const httpsOptions = {
  cert: fs.readFileSync('C:\\Users\\kaiqu\\Desktop\\comunicator\\backend\\ssl\\certs\\ca.crt'),
  key: fs.readFileSync('C:\\Users\\kaiqu\\Desktop\\comunicator\\backend\\ssl\\certs\\ca.key')
}

async function startApolloServer() {
  const app = express();
  const httpServer = https.createServer(httpsOptions, app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at https://localhost:4000${server.graphqlPath}`);
}

startApolloServer().catch((err) => console.log(err));