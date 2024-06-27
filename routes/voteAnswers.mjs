import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const voteAnswerRouter = Router();

voteAnswerRouter.post("/:id/upvote", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await connectionPool.query(
      "UPDATE answers SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error upvoting answer:", error);
    res.status(500).json({
      message: "Server could not upvote answer due to a database error",
    });
  }
});

voteAnswerRouter.post("/:id/downvote", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await connectionPool.query(
      "UPDATE answers SET downvotes = downvotes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error downvoting answer:", error);
    res.status(500).json({
      message: "Server could not downvote answer due to a database error",
    });
  }
});

export default voteAnswerRouter;
