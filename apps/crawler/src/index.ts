import { Queue } from "bullmq";
import IORedis from "ioredis";
import { fetchAllActiveAuctions, AuctionData } from "./services/bazaarScraper";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const bazaarQueue = new Queue("bazaar-queue", {
  connection: connection as unknown as Queue["opts"]["connection"],
});

async function startCrawler() {
  try {
    let totalSent = 0;

    await fetchAllActiveAuctions(async (items: AuctionData[]) => {
      for (const item of items) {
        await bazaarQueue.add(
          "process-auction",
          {
            name: item.name,
            level: item.level,
            vocation: item.vocation,
            world: item.world,
            outfitUrl: item.outfitUrl,
            price: item.currentBid,
            endsAt: item.endDate,
            auctionId: item.auctionId,
            skills: item.skills,
            items: item.items,
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
      totalSent += items.length;
      console.log(
        `[CRAWLER] ${items.length} leiloes da pagina enviados para a fila. Total ate agora: ${totalSent}`,
      );
    });

    console.log(
      `[CRAWLER] Finalizado. Total de ${totalSent} leiloes sincronizados.`,
    );
  } catch (error) {
    console.error("[CRAWLER] Erro ao executar:", error);
  } finally {
    await connection.quit();
  }
}

startCrawler();
