export const validateAnswerField = (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({
      message: "Missing required field: content is required",
    });
  }

  next();
};
