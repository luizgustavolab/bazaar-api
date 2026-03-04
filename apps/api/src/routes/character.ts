import { FastifyInstance } from "fastify";
import prisma from "../prismaClient";

export async function characterRoutes(fastify: FastifyInstance) {
  fastify.get("/characters", async () => {
    const characters = await prisma.character.findMany({
      orderBy: { level: "desc" },
      take: 50,
    });
    return characters;
  });

  fastify.get("/characters/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const character = await prisma.character.findUnique({
      where: { id: parseInt(id) },
    });
    if (!character) {
      reply.status(404).send({ error: "Character not found" });
      return;
    }
    return character;
  });
}