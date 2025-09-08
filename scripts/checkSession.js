// scripts/checkSession.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const token = "5ef333eb-0b5e-4b9b-913c-49acbd3b443b"; // from your cookie

async function main() {
  const s = await prisma.session.findUnique({
    where: { sessionToken: token },
  });
  console.log("session row:", s);
}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
