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
    auction: character.auction
      ? {
          id: character.auction.id,
          price: character.auction.price,
          endsAt: character.auction.endsAt,
        }
      : null,
  };
}
