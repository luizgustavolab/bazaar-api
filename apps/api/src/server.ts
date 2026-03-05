import app from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3333;

app
  .listen({ port: PORT, host: "0.0.0.0" })
  .then(() => {
    console.log(`Server running on port ${PORT}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
