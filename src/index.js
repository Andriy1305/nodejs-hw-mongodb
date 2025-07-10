import { setupServer } from './server.js';
import { initMongoConnection } from './bd/initMongoConnection.js';
//import { Contact } from '../models/contact.js';

const bootstrap = async () => {
  await initMongoConnection();

  setupServer();
};
// node ./src/index.js
bootstrap();
