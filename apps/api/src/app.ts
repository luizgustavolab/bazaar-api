import Fastify from "fastify";
import cors from "@fastify/cors";
import { characterRoutes } from "./routes/character";
import { healthRoutes } from "./controllers/healthController";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

app.register(healthRoutes);
app.register(characterRoutes);

export default app;
