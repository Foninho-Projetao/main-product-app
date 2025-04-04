const express = require("express");
var cors = require('cors')
const app = express();
app.use(express.json()); 
app.use(cors())

//Ellian/Progresso
const router = require("./views/progresso.routes");
app.use("/", router);

const exercisesRouter = require("./views/exercises.routes");
app.use("/", exercisesRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});