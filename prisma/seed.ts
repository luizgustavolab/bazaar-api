import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const characters = [
    { name: "Arthas", level: 150, vocation: "Knight", world: "Antica" },
    { name: "Jaina", level: 130, vocation: "Sorcerer", world: "Antica" },
    { name: "Thrall", level: 140, vocation: "Paladin", world: "Carlin" },
    { name: "Illidan", level: 160, vocation: "Druid", world: "Carlin" },
    { name: "Sylvanas", level: 120, vocation: "Sorcerer", world: "Venore" },
  ];

  for (const char of characters) {
    await prisma.character.create({
      data: char,
    });
  }

  console.log("Seed data inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
