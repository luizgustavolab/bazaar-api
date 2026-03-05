import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

new Worker(
  "bazaar-queue",
  async (job: Job) => {
    try {
      const {
        name,
        level,
        vocation,
        world,
        outfitUrl,
        skills,
        items,
        price,
        endsAt,
      } = job.data;

      await prisma.character.upsert({
        where: { name },
        update: {
          level,
          vocation,
          world,
          outfitUrl,
          skills: skills ? JSON.stringify(skills) : "{}",
          items: items ? JSON.stringify(items) : "[]",
          auction: {
            upsert: {
              create: { price, endsAt },
              update: { price, endsAt },
            },
          },
        },
        create: {
          name,
          level,
          vocation,
          world,
          outfitUrl,
          skills: skills ? JSON.stringify(skills) : "{}",
          items: items ? JSON.stringify(items) : "[]",
          auction: {
            create: { price, endsAt },
          },
        },
      });

      console.log(`[WORKER] Dados de ${name} sincronizados.`);
    } catch (error) {
      console.error(`[WORKER] Erro no job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: connection as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
);
