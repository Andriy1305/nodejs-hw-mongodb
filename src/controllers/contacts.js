import {
  getContactById,
  getAllContacts,
  greateContact,
  deleteContact,
  patchContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';

import { parsePaginationContact } from '../utils/parseParams';
import { parseSortParams } from '../utils/parseSortParams.js';
import { filterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

import fs from 'node:fs/promises';
import path from 'node:path';

export const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, 'Route not found'));
};

export const getContactByIdController = async (req, res) => {
  const contactId = req.params.id.trim();
  const contact = await getContactById(contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  //if (contact.userId.toString() !== req.user._id.toString()) {
  // throw new createHttpError.Forbidden('Contact restricted');
  //}
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contact,
  });
};

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationContact(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = filterParams(req.query);
  //console.log('FILTR:', filters);
  //console.log({ sortBy, sortOrder });
  //console.log(page, perPage);
  //console.log('CONSOL:', req.user);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
    userId: req.user._id,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const createContactControl = async (req, res) => {
  let photo = null;
  if (req.file) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src/uploads/photos', req.file.filename),
      );
      photo = `http://localhost:8080/photos/${req.file.filename}`;
    }
  }
  const contact = await greateContact({
    ...req.body,
    photo,
    userId: req.user._id,
  });
  //console.log({ RESULT: contact });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const result = await deleteContact(req.params.id, req.user._id);
  //console.log({ DELETE: result });
  if (result === null) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).end();
};

export const updateContactControler = async (req, res) => {
  let updateData = { ...req.body };
  if (req.file) {
    let photo = null;

    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src/uploads/photos', req.file.filename),
      );
      photo = `http://localhost:8080/photos/${req.file.filename}`;
    }

    updateData.photo = photo;
  }

  const result = await patchContact(req.params.id, req.user._id, updateData);
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
