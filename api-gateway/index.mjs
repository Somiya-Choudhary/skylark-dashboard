import { serve } from '@hono/node-server';
import app from './src/app.mjs';

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
  }
);





// import { serve } from '@hono/node-server';
// import { Hono } from 'hono';

// const app = new Hono();

// app.get('/', (c) => {
//     return c.text('Hello Node.js with Hono!');
// });

// serve({
//     fetch: app.fetch,
//     port: 3000,
// }, (info) => {
//     console.log(`Server listening on http://localhost:${info.port}`);
// });
