import express from 'express';
import { createYoga } from 'graphql-yoga';
import cors from 'cors';
import dotenv from 'dotenv';
import { schema } from './schema/index';
import { createContext } from './lib/context';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// CORS middleware
app.use(cors());

// Create GraphQL Yoga instance
const yoga = createYoga({
  schema,
  context: createContext,
  graphiql: {
    title: 'My GraphQL API',
  },
  graphqlEndpoint: '/graphql',
  logging: 'debug',
  maskedErrors: false,
  plugins: [
    {
      onRequest: ({ request }) => {},
    },
  ],
});

app.use('/graphql', yoga);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${port}/graphql`);
});
