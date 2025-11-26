"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    transactionOptions: {
        maxWait: 10000,
        timeout: 20000
    }
});
exports.default = prisma;
