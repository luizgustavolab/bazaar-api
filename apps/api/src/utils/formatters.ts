import { Character, Auction } from "@prisma/client";

type CharacterWithAuction = Character & {
  auction?: Auction | null;
};

export function formatCharacterData(character: CharacterWithAuction) {
  return {
    id: character.id,
    name: character.name,
    level: character.level,
    vocation: character.vocation,
    world: character.world,
    outfitUrl: character.outfitUrl,

    skills:
      typeof character.skills === "string"
        ? JSON.parse(character.skills)
        : character.skills || {},

    items:
      typeof character.items === "string"
        ? JSON.parse(character.items)
        : character.items || [],

    price: character.auction ? Number(character.auction.price) : 0,
    endsAt: character.auction?.endsAt || null,
    auctionId: character.auction?.id || null,
  };
}
