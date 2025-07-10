import pino from 'pino-http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import {
  getContactByIdContriller,
  getAllContactsContriller,
} from './controllers/contactsController.js';

//import { Contact } from '../models/contact.js';

//==ОТОЧЕННЯ==//
dotenv.config();
//==ОТОЧЕННЯ==//

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
  app.get('/contacts/:contactId', getContactByIdContriller);
  app.get('/contacts', getAllContactsContriller);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
  const PORT = process.env.PORT || 3000;

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
