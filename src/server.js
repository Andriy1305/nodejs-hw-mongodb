import pino from 'pino-http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

//==ОТОЧЕННЯ==//
dotenv.config();
//==ОТОЧЕННЯ==//

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  //==CORS==//
  app.use(cors());
  //==CORS==//

  app.use(express.json());

  // ==PINO==//
  app.use(pino({ transport: { target: 'pino-pretty' } }));
  //==PINO==//

  //==РОУТИ==
  app.use('/contacts', contactRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
};

//node ./src/server.js
//   AT11vQxXZ6t8PgUD
//  mongodb+srv://student:AT11vQxXZ6t8PgUD@cluster0.jj8ksp7.mongodb.net/university?retryWrites=true&w=majority
