import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateAnswerField } from "../middleware/answer.validate.mjs";

const answersRouter = Router();

answersRouter.post(
  "/questions/:id/answers",
  [validateAnswerField],
  async (req, res) => {
    const { content } = req.body;
    const question_id = req.params.id;

    const newAnswer = {
      question_id,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      const response = await connectionPool.query(
        "INSERT INTO answers (question_id, content, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          newAnswer.question_id,
          newAnswer.content,
          newAnswer.created_at,
          newAnswer.updated_at,
        ]
      );

      res.status(201).json(response.rows[0]);
    } catch (error) {
      console.error("Error inserting answer:", error);
      res.status(500).json({
        message: "Server could not create answer because of a database error",
      });
    }
  }
);

answersRouter.get("/questions/:id/answers", async (req, res) => {
  const question_id = req.params.id;
  try {
    const response = await connectionPool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [question_id]
    );
    if (!response.rows[0]) {
      return res
        .status(404)
        .json({ message: "No answers found for the specified question" });
    }
    res.status(200).json(response.rows);
  } catch (error) {
    console.error("Error retrieving answers:", error);
    res.status(500).json({
      message: "Server could not retrieve answers because of a database error",
    });
  }
});

answersRouter.get("/answers/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await connectionPool.query(
      "SELECT * FROM answers WHERE id = $1",
      [id]
    );
    if (!response.rows[0]) {
      return res
        .status(404)
        .json({ message: `Answer not found (answer id: ${id})` });
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error retrieving answer:", error);
    res.status(500).json({
      message: "Server could not retrieve answer because of a database error",
    });
  }
});

export default answersRouter;
