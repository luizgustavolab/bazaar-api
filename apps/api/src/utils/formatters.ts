import { Character, Auction } from "@prisma/client";

// Definindo a interseção para garantir que o objeto tenha os dados do leilão
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
    
    // Tratando as strings do SQLite com segurança de tipo
    skills: typeof character.skills === 'string' 
      ? JSON.parse(character.skills) 
      : (character.skills || {}),
      
    items: typeof character.items === 'string' 
      ? JSON.parse(character.items) 
      : (character.items || []),
    
    // Opcional encadeado (Optional Chaining) seguro com o tipo Auction
    price: character.auction?.price || 0,
    endsAt: character.auction?.endsAt || null
  };
}