import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  sendResetPasswordEmailService,
  resetPasswordService,
} from '../services/auth.js';

export const registerControler = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginControler = async (req, res) => {
  const session = await loginUser(req.body.email, req.body.password);
  //console.log(session);
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutControler = async (req, res) => {
  //console.log(req.cookies);

  const { sessionId } = req.cookies;
  //console.log('CONSOL:', sessionId);

  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};

export const refreshControler = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  //console.log('CONSOLE:', sessionId, refreshToken);

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const passwordRethetControler = async (req, res) => {
  await sendResetPasswordEmailService(req.body.email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordControler = async (req, res) => {
  const { token, password } = req.body;
  await resetPasswordService(token, password);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
