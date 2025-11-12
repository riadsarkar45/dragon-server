import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(
    {
        transactionOptions: {
            maxWait: 10000,
            timeout: 20000
        }
    }
);

export default prisma;