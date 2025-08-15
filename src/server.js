import * as fs from 'node:fs';
import pino from 'pino-http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contacts.js';

import swaggerUI from 'swagger-ui-express';

import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

//==ОТОЧЕННЯ==//
dotenv.config();
//==ОТОЧЕННЯ==//

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, '..', 'docs', 'swagger.json');

const SWAGGER_DOCUMENT = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

export const setupServer = () => {
  const app = express();

  //==CORS==//
  app.use(cors());
  //==CORS==//

  app.use(express.json());

  // ==PINO==//
  app.use(pino({ transport: { target: 'pino-pretty' } }));
  //==PINO==//

  //==MIDDLEWARE COOKIE PARSER==//
  app.use(cookieParser());
  //==MIDDLEWARE COOKIE PARSER==//

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCUMENT));
  app.use('/photos', express.static(path.resolve('src/uploads/photos')));

  //==РОУТИ==
  app.use('/contacts', authenticate, contactRoutes);
  app.use('/auth', authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
};
