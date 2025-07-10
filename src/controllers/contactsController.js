import { getContactById, getAllContacts } from '../services/contacts.js';

export const getContactByIdContriller = async (req, res) => {
  try {
    const contactId = req.params.id.trim();
    const contact = await getContactById(contactId);
    console.log('Контакти:', JSON.stringify(contact, null, 2));
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contact,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 400,
        message: 'Invalid contact ID format',
      });
    }

    res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
};

export const getAllContactsContriller = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    console.log('Контакти:', JSON.stringify(contacts, null, 2));
    res.status(200).json({
      status: 200,
      data: contacts,
      message: 'Successfully found contacts!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
};
