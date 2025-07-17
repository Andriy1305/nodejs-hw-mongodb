import {
  getContactById,
  getAllContacts,
  greateContact,
  deleteContact,
  patchContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, 'Route not found'));
};

export const getContactByIdController = async (req, res) => {
  const contactId = req.params.id.trim();
  const contact = await getContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contact,
  });
};

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    data: contacts,
    message: 'Successfully found contacts!',
  });
};

export const createContactControl = async (req, res) => {
  //console.log({ BODY: req.body });
  const contact = await greateContact(req.body);
  //console.log({ RESULT: contact });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const result = await deleteContact(req.params.id);
  //console.log({ DELETE: result });
  if (result === null) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).end();
};

export const updateContactControler = async (req, res) => {
  const result = await patchContact(req.params.id, req.body);
  // console.log({ PATCH: result });
  if (result === null) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
