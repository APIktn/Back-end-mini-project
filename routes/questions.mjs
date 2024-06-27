import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateQuestionsField } from "../middleware/question.validate.mjs";

const questionRouter = Router();

questionRouter.post("/", [validateQuestionsField], async (req, res) => {
  const newQuestion = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    const response = await connectionPool.query(
      `INSERT INTO questions (title, description, category, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5) `,
      [
        newQuestion.title,
        newQuestion.description,
        newQuestion.category,
        newQuestion.created_at,
        newQuestion.updated_at,
      ]
    );

    res.status(201).json({
      message: `Question created successfully.`,
      data: response.rows[0],
    });
  } catch (error) {
    console.error("Error create question:", error);
    res.status(500).json({
      message: `Server could not create question because of a database error`,
    });
  }
});

questionRouter.get("/", async (req, res) => {
  const title = req.query.title;
  const category = req.query.category;

  console.log("Received query parameters:", { title, category });

  try {
    const response = await connectionPool.query(
      `SELECT * FROM questions
               WHERE (title = $1 OR $1 IS NULL OR $1 = '')
               AND (category = $2 OR $2 IS NULL OR $2 = '')`,
      [title, category]
    );

    return res.status(200).json({
      message: "Successfully retrieved the search results.",
      data: response.rows,
    });
  } catch (error) {
    console.error("Error querying the database:", error);
    return res.status(500).json({
      message: "Server could not read post because of a database issue",
    });
  }
});

questionRouter.get("/:id", async (req, res) => {
  try {
    const idFromClient = req.params.id;
    const response = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [idFromClient]
    );
    if (!response.rows[0]) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({
      message: `Successfully retrieved the question`,
      data: response.rows[0],
    });
  } catch (error) {
    console.error("Error retrieving question:", error);
    res.status(500).json({
      message: "Server could not retrieve question because of a database error",
    });
  }
});

questionRouter.put("/:id", [validateQuestionsField], async (req, res) => {
  const idFromClient = req.params.id;
  const updatedQuestion = { ...req.body, updated_at: new Date() };

  try {
    const response = await connectionPool.query(
      `SELECT * FROM questions WHERE id = $1`,
      [idFromClient]
    );

    if (!response.rows[0]) {
      return res.status(404).json({
        message: `Question not found (Question id: ${idFromClient})`,
      });
    }

    const updateResponse = await connectionPool.query(
      `
        UPDATE questions
        SET title = $2,
            description = $3,
            category = $4,
            updated_at = $5
        WHERE id = $1
        RETURNING *`,
      [
        idFromClient,
        updatedQuestion.title,
        updatedQuestion.description,
        updatedQuestion.category,
        updatedQuestion.updated_at,
      ]
    );

    return res.status(200).json({
      message: "Successfully updated the question.",
      data: updateResponse.rows[0],
    });
  } catch (error) {
    console.error("Error querying the database:", error);
    return res.status(500).json({
      message: "Server could not update Question because of a database issue",
    });
  }
});

questionRouter.delete("/:id", async (req, res) => {
  const idFromClient = req.params.id;
  try {
    const response = await connectionPool.query(
      "DELETE FROM questions WHERE id = $1",
      [idFromClient]
    );
    if (response.rowCount === 0) {
      return res
        .status(404)
        .json({ message: `Question not found (id: ${idFromClient})` });
    }
    res.status(200).json({ message: "Successfully deleted the question" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      message: "Server could not delete question because of a database error",
    });
  }
});

export default questionRouter;
