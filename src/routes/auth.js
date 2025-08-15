import express from 'express';
import {
  registerControler,
  loginControler,
  logoutControler,
  refreshControler,
  passwordRethetControler,
  resetPasswordControler,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  reqwestPasswordRethet,
  resetPassword,
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerControler),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginControler),
);

router.post('/logout', ctrlWrapper(logoutControler));

router.post('/refresh', ctrlWrapper(refreshControler));

router.post(
  '/send-reset-email',
  validateBody(reqwestPasswordRethet),
  ctrlWrapper(passwordRethetControler),
);
router.post(
  '/reset-pwd',
  validateBody(resetPassword),
  ctrlWrapper(resetPasswordControler),
);

//router.get('/api-docs');

export default router;
