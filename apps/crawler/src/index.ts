import { Queue } from "bullmq";
import IORedis from "ioredis";
import { fetchAllActiveAuctions } from "./services/bazaarScraper";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const bazaarQueue = new Queue("bazaar-queue", { connection });

async function startCrawler() {
  try {
    const auctions = await fetchAllActiveAuctions();

    for (const item of auctions) {
      await bazaarQueue.add(
        "process-auction",
        {
          name: item.name,
          level: item.level,
          vocation: item.vocation,
          world: item.world,
          outfitUrl: item.outfitUrl,
          skills: item.skills,
          items: item.items,
          price: item.currentBid,
          endsAt: item.endDate,
        },
        {
          removeOnComplete: true,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        },
      );
    }

    console.log(`[CRAWLER] ${auctions.length} leilões enviados para a fila.`);
  } catch (error) {
    console.error("[CRAWLER] Erro ao executar:", error);
  } finally {
    await connection.quit();
  }
}

startCrawler();
