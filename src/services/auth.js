import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

import createHttpError from 'http-errors';

import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMails.js';

import bcrypt from 'bcrypt';
//  import { hasUncaughtExceptionCaptureCallback } from 'node:process';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError.Unauthorized('Incorrect email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  // console.log(isMatch);
  if (!isMatch) {
    throw createHttpError.Unauthorized('Incorrect email or password');
  }

  await Session.deleteOne({ userId: user._id });
  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 200 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findById(sessionId);

  //console.log('CONSOLE 2:', session, sessionId);

  if (session === null) {
    throw createHttpError.Unauthorized('Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw createHttpError.Unauthorized(' Refresh token invalid');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError.Unauthorized('Refresh token expired');
  }
  await Session.deleteOne({ _id: session._id });
  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 200 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};
//=====СКИДАННЯ ПАРОЛЮ===//
export const sendResetPasswordEmailService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    //throw new createHttpError.NotFound('User not found');
    throw createHttpError(404, 'User not found!');
  }
  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' },
  );
  //console.log(user);
  //console.log(token);

  const appDomain = getEnvVar('APP_DOMAIN');

  const resetLink = `${appDomain}/reset-password?token=${token}`;

  try {
    await sendMail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  } catch (err) {
    console.error('Email send error:', err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

//=====ЗМІНА ПАРОЛЮ===//
export const resetPasswordService = async (token, password) => {
  let decoded;

  try {
    decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  await Session.deleteMany({ userId: user._id });
};
