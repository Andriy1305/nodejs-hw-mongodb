import express from 'express';
import {
  getContactByIdController,
  getAllContactsController,
  createContactControl,
  deleteContactController,
  updateContactControler,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactControl),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

router.patch(
  '/:id',
  upload.single('photo'),
  validateBody(updateContactSchema),
  isValidId,
  ctrlWrapper(updateContactControler),
);

export default router;
