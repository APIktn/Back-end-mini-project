export const validateQuestionsField = (req, res, next) => {
  const { title, description, category } = req.body;
  const missingFields = [];

  if (!title) missingFields.push("title");
  if (!description) missingFields.push("description");
  if (!category) missingFields.push("category");

  if (missingFields.length > 0) {
    const missingFieldsData = missingFields.join(", ");
    const verb = missingFields.length > 1 ? "are" : "is";
    const fields = missingFields.length > 1 ? "fields" : "field";

    return res.status(400).json({
      message: `Bad Request: The following ${fields} ${verb} missing or invalid: ${missingFieldsData}`,
    });
  }

  next();
};
