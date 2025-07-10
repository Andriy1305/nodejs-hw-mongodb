import { Contact } from '../models/contact.js';

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const getAllContacts = async () => {
  return await Contact.find();
};
