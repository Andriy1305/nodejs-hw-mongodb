import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  // console.log('KONSOL:', req.params.id);
  // console.log('KONSOL:', req.params);
  const id = req.params.id;
  // console.log('KONSOL:', id);
  let sum = isValidObjectId(id);
  //console.log('KONSOL:', sum);
  if (!sum) {
    return next(createHttpError(400, 'Bad Request'));
  }
  next();
};
