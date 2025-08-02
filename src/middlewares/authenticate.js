import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  //console.log('AUTH');
  //console.log(req.headers.authorization);
  const { authorization } = req.headers;
  //console.log(authorization);
  if (typeof authorization !== 'string') {
    throw createHttpError.Unauthorized('Please provide access token');
  }
  const [bearer, accessToken] = authorization.split(' ', 2);
  // console.log('CONSOL:', bearer, accessToken);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    throw createHttpError.Unauthorized('Please provide access token');
  }
  //console.log('Checking accessToken:', accessToken);

  const session = await Session.findOne({ accessToken });
  //console.log(session);
  if (!session) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.accessTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Access token expired');
  }

  //console.log(session.userId);
  const user = await User.findById(session.userId);

  //  console.log(user);
  if (user === null) {
    throw new createHttpError.Unauthorized('User not found');
  }
  req.user = { _id: user._id, name: user.name };
  next();
};
