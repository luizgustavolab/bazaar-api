import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prismaClient";
import { CreateCharacterDto } from "../types/character";

export async function listCharacters(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const characters = await prisma.character.findMany({
    include: { auction: true },
  });
  return reply.send(characters);
}

export async function createCharacter(
  request: FastifyRequest<{ Body: CreateCharacterDto }>,
  reply: FastifyReply,
) {
  const { name, vocation, level, world, price, endsAt } = request.body;

  const character = await prisma.character.create({
    data: { name, vocation, level, world },
  });

  if (price && endsAt) {
    await prisma.auction.create({
      data: { characterId: character.id, price, endsAt: new Date(endsAt) },
    });
  }

  return reply.send(character);
}
