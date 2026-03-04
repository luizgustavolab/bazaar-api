import { FastifyReply, FastifyRequest } from "fastify";

export async function getHealth(
  _request: FastifyRequest,
  _reply: FastifyReply,
) {
  return { status: "ok" };
}
