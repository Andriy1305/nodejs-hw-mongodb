import express from 'express';
import {
  getContactByIdController,
  getAllContactsController,
  createContactControl,
  deleteContactController,
  updateContactControler,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id', ctrlWrapper(getContactByIdController));

router.post('/', ctrlWrapper(createContactControl));

router.delete('/:id', ctrlWrapper(deleteContactController));

router.patch('/:id', ctrlWrapper(updateContactControler));

export default router;
