import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const voteQuestionRouter = Router();

voteQuestionRouter.post("/:id/upvote", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await connectionPool.query(
      "UPDATE questions SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Question not found (id: ${id})` });
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error upvoting question:", error);
    res.status(500).json({
      message: "Server could not upvote question because of a database error",
    });
  }
});

voteQuestionRouter.post("/:id/downvote", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await connectionPool.query(
      "UPDATE questions SET downvotes = downvotes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Question not found (id: ${id})` });
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error downvoting question:", error);
    res.status(500).json({
      message: "Server could not downvote question because of a database error",
    });
  }
});

export default voteQuestionRouter;
