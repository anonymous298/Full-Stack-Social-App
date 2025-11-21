import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaNeon } from '@prisma/adapter-neon'
import 'dotenv/config'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});


export async function main() {
  await prisma.user.create({
    data : {
        email : 'talha@gmail.com',
        username : 'talha23423423',
        clerkId: '234sdf@sdf3cdfsd2d3g'
    }
  })
}

main();