require("express-async-errors");
const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());

app.use(routes);

app.use((error, request, response, next) => {
  //verificando se é erro do cliente
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  //mostrando no console pra debugar
  console.error(error);

  //se for erro do servidor
  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 3030;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
