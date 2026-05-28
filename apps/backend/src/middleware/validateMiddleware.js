const validateMiddleware = (schema) => (req, res, next) => {
  const { error } = schema(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }
  next();
};

module.exports = validateMiddleware;
