export const transformBodyTypes = (req, res, next) => {
  const body = { ...req.body };

  // Якщо є поле isFavourite, конвертуємо рядок у boolean
  if (body.isFavourite !== undefined) {
    if (body.isFavourite === 'true') {
      body.isFavourite = true;
    } else if (body.isFavourite === 'false') {
      body.isFavourite = false;
    } else {
      // Якщо якесь інше значення, видаляємо або ставимо false
      delete body.isFavourite;
    }
  }

  // Прибрати порожні рядки (наприклад, photo: '')
  Object.keys(body).forEach((key) => {
    if (body[key] === '') {
      delete body[key];
    }
  });

  req.body = body;
  next();
};
