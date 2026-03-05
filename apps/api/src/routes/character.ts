import { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import prisma from "../prismaClient";
import { formatCharacterData } from "../utils/formatters";

interface CharacterQuery {
  vocation?: string;
  world?: string;
  minLevel?: string;
  maxLevel?: string;
}

export async function characterRoutes(fastify: FastifyInstance) {
  fastify.get("/", async () => {
    return {
      message: "Tibia Scout API",
      endpoints: ["/characters", "/characters/expired", "/health"],
    };
  });

  fastify.get("/characters", async (request) => {
    const { vocation, world, minLevel, maxLevel } =
      request.query as CharacterQuery;

    const where: Prisma.CharacterWhereInput = {};

    if (vocation) {
      where.vocation = { equals: vocation };
    }

    if (world) {
      where.world = { equals: world };
    }

    if (minLevel || maxLevel) {
      where.level = {
        ...(minLevel && { gte: parseInt(minLevel) }),
        ...(maxLevel && { lte: parseInt(maxLevel) }),
      };
    }

    const characters = await prisma.character.findMany({
      where,
      include: {
        auction: true,
      },
      orderBy: { level: "desc" },
      take: 50,
    });

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

  fastify.delete("/characters/expired", async (_request, reply) => {
    try {
      const nowInSeconds = Math.floor(Date.now() / 1000).toString();

      const expiredAuctions = await prisma.auction.findMany({
        where: {
          endsAt: {
            lt: nowInSeconds,
          },
        },
        select: {
          characterId: true,
        },
      });

      const characterIds = expiredAuctions.map((a) => a.characterId);

      const deleted = await prisma.character.deleteMany({
        where: {
          id: {
            in: characterIds,
          },
        },
      });

      return {
        message: "Limpeza concluída",
        count: deleted.count,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
