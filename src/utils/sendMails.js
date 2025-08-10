import nodemailer from 'nodemailer';

import { getEnvVar } from './getEnvVar.js';

//console.log(`SMTP_PASSWORD: '${process.env.SMTP_PASSWORD}'`);

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: Number(getEnvVar('SMTP_PORT')),
  secure: false,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});
//console.log('SMTP config:', {
// host: process.env.SMTP_HOST,
// port: process.env.SMTP_PORT,
// user: process.env.SMTP_USER,
// pass: process.env.SMTP_PASSWORD?.slice(0, 5) + '***',
//});

export const sendMail = (mail) => {
  mail.from = getEnvVar('SMTP_FROM');
  return transporter.sendMail(mail);
};
