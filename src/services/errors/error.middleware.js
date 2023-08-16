export const errorMiddleware = (error, req, res, next) => {
  /* console.error(
    `${new Date().toISOString()} - Error: ${error.message}, status: ${
      error.status
    }`
  ); */
  res.status(error.status || 500).send({
    name: error.name,
    message: error.message,
    cause: error.cause,
  });
};
