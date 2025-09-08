
// scripts/checkUser.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userId = "cmf7poqb100008zzd4huby62e"; // from the session row

async function main() {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  console.log("user row:", user);
}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
