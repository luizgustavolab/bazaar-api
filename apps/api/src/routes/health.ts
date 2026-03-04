import { FastifyInstance } from "fastify";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/", async () => {
    return { status: "ok" };
  });

  fastify.get("/health", async () => {
    return { status: "ok" };
  });
}
