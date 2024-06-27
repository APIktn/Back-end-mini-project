import express from "express";
import questionRouter from "./routes/questions.mjs";
import answersRouter from "./routes/answers.mjs";
import voteQuestionRouter from "./routes/voteQuestions.mjs";
import voteAnswerRouter from "./routes/voteAnswers.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionRouter);
app.use("/", answersRouter);
app.use("/questions", voteQuestionRouter);
app.use("/answers", voteAnswerRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
