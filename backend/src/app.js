const express = require("express");
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

//Ellian/Progresso
const router = require("./routes/progresso.routes");
const pacienteRoutes = require("./routes/paciente.routes");
app.use("/progresso", router);
app.use("/pacientes", pacienteRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
