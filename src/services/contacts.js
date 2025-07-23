import { Contact } from '../models/contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContactById = (contactId) => {
  return Contact.findById(contactId);
};

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
}) => {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = Contact.find(filters);

  //const count = await Contact.countDocuments();
  //console.log('CONSOL:', count);

  const [count, contacts] = await Promise.all([
    Contact.countDocuments(filters),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);

  //const contacts = await contactsQuery.skip(skip).limit(limit).exec();

  const paginationData = await calculatePaginationData(count, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const greateContact = (payload) => {
  return Contact.create(payload);
};

export const deleteContact = (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};

export const patchContact = (contactId, payload) => {
  return Contact.findByIdAndUpdate(contactId, payload, { new: true });
};
