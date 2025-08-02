import { Contact } from '../models/contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContactById = (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
  userId,
}) => {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const finalFilters = { ...filters, userId };

  const contactsQuery = Contact.find(finalFilters);

  //contactsQuery.where('userId').equals(userId);

  //const count = await Contact.countDocuments();
  //console.log('CONSOL:', count);

  const [count, contacts] = await Promise.all([
    Contact.countDocuments(finalFilters),
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

export const deleteContact = (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};

export const patchContact = (contactId, userId, payload) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
  });
};
