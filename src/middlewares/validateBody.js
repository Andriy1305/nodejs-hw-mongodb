import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      // console.log('KONSOL:', req.body);
      await schema.validateAsync(req.body, {
        abortEarly: false,
      });

      //console.log('KONSOL2:', result);
      next();
    } catch (error) {
      const errorValue = error.details.map((details) => details.message);
      //console.log('KONSOLE3:', errorValue);
      return next(
        createHttpError(400, `Bad Request: ${errorValue.join(', ')}`),
      );
    }
  };
};
