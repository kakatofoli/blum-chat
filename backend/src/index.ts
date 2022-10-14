import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { getSession } from 'next-auth/react';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import https from 'https';
import fs from 'fs';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import * as dotenv from 'dotenv';
import { GraphQLContext, Session } from './util/types';

const httpsOptions = {
  cert: fs.readFileSync('C:\\Users\\kaiqu\\Desktop\\comunicator\\backend\\ssl\\certs\\blumchat.com.pem'),
  key: fs.readFileSync('C:\\Users\\kaiqu\\Desktop\\comunicator\\backend\\ssl\\certs\\blumchat.com.key')
}

async function startApolloServer() {
  dotenv.config();
  const app = express();
  const httpServer = https.createServer(httpsOptions, app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }

  const prisma = new PrismaClient();


  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const session = await getSession({ req }) as Session;
      return { session, prisma };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at https://localhost:4000${server.graphqlPath}`);
}

startApolloServer().catch((err) => console.log(err));