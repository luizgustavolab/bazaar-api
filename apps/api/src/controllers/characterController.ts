import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../prismaClient";
import { formatCharacterData } from "../utils/formatters";

export const getCharacters = async (_request: FastifyRequest) => {
  const characters = await prisma.character.findMany({
    include: {
      auction: true,
    },
    take: 50,
  });

  return characters.map(formatCharacterData);
};

export const getCharacterById = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params as { id: string };

  const charId = parseInt(id);

  if (isNaN(charId)) {
    return reply.status(400).send({ error: "ID inválido. Use um número." });
  }

  const character = await prisma.character.findUnique({
    where: { id: charId },
    include: { auction: true },
  });

  if (!character) {
    return reply.status(404).send({ error: "Character not found" });
  }

  return formatCharacterData(character);
};
