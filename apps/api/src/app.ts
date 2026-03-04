import Fastify from "fastify";
import { characterRoutes } from "./routes/character";

const app = Fastify({
  logger: true,
});

app.register(characterRoutes);

export default app;
