export interface CreateCharacterDto {
  name: string;
  vocation: string;
  level: number;
  world: string;
  price?: number;
  endsAt?: string;
}
