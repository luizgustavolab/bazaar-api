import * as cheerio from "cheerio";
import axios from "axios";

export interface AuctionData {
  auctionId: number;
  name: string;
  level: number;
  vocation: string;
  world: string;
  currentBid: number;
  endDate: string;
  outfitUrl: string;
  skills: string[];
  items: string[];
}

export async function fetchBazaarPage(pageNumber: number = 1): Promise<string> {
  const url = `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&currentpage=${pageNumber}`;
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  return data;
}

export function parseBazaarHTML(html: string): AuctionData[] {
  const $ = cheerio.load(html);
  const auctions: AuctionData[] = [];

  $(".Auction").each((_, element) => {
    const auctionLink =
      $(element).find(".AuctionCharacterName a").attr("href") || "";
    const auctionId = parseInt(auctionLink.split("auctionid=")[1] || "0");
    const name = $(element).find(".AuctionCharacterName").text().trim();

    const headerText = $(element).find(".AuctionHeader").text().trim();
    const levelMatch = headerText.match(/Level:\s*(\d+)/);
    const vocationMatch = headerText.match(/Vocation:\s*([^|]+)/);
    const world = $(element)
      .find('.AuctionHeader a[target="_blank"]')
      .text()
      .trim();

    const level = levelMatch ? parseInt(levelMatch[1]) : 0;
    const vocation = vocationMatch ? vocationMatch[1].trim() : "Unknown";

    const bidElement = $(element).find(".ShortAuctionDataValue b");
    const bidText = bidElement
      .text()
      .replace(/[,.\s]/g, "")
      .trim();
    const currentBid = parseInt(bidText) || 0;

    const endDate =
      $(element).find(".AuctionTimer").attr("data-timestamp") || "";
    const outfitUrl = $(element).find(".AuctionOutfitImage").attr("src") || "";

    const skills: string[] = [];
    $(element)
      .find(".SpecialCharacterFeatures .Entry")
      .each((_, el) => {
        skills.push($(el).text().trim());
      });

    const items: string[] = [];
    $(element)
      .find(".AuctionItemsViewBox .CVIcon")
      .each((_, el) => {
        const itemTitle = $(el).attr("title");
        if (itemTitle && !itemTitle.includes("no item")) {
          items.push(itemTitle);
        }
      });

    if (auctionId > 0 && name) {
      auctions.push({
        auctionId,
        name,
        level,
        vocation,
        world,
        currentBid,
        endDate,
        outfitUrl,
        skills,
        items,
      });
    }
  });

  return auctions;
}

export async function fetchAllActiveAuctions(): Promise<AuctionData[]> {
  const allResults: AuctionData[] = [];
  const page = 1;
  const html = await fetchBazaarPage(page);
  const items = parseBazaarHTML(html);

  if (items.length > 0) {
    allResults.push(...items);
  }

  return allResults;
}
