import Fastify from "fastify";
import { characterRoutes } from "./controllers/characterController";
import { healthRoutes } from "./controllers/healthController";

const app = Fastify({ logger: true });

app.register(healthRoutes);
app.register(characterRoutes);

export default app;
