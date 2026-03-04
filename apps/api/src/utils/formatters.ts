import { FastifyInstance } from "fastify";
import prisma from "../prismaClient";
import { formatCharacterData } from "../utils/formatters";

export async function characterRoutes(fastify: FastifyInstance) {
  // Rota raiz para evitar 404 em http://localhost:3333/
  fastify.get("/", async () => {
    return {
      message: "Tibia Scout API",
      endpoints: ["/characters", "/health"],
    };
  });

  fastify.get("/characters", async () => {
    const characters = await prisma.character.findMany({
      include: {
        auction: true,
      },
      orderBy: { level: "desc" },
      take: 50,
    });

    // É essencial usar o .map aqui para transformar as strings do SQLite em Arrays reais
    return characters.map(formatCharacterData);
  });

  fastify.get("/characters/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const character = await prisma.character.findUnique({
      where: { id: parseInt(id) },
      include: { auction: true },
    });

    if (!character) {
      return reply.status(404).send({ error: "Character not found" });
    }

    return formatCharacterData(character);
  });
}
