"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConnect = void 0;
const prisma_1 = __importDefault(require("../Prisma/prisma"));
const databaseConnect = (fastify) => {
    fastify.addHook("onReady", async () => {
        try {
            await prisma_1.default.$connect();
            fastify.log.info("Database connected successfully.");
        }
        catch (err) {
            if (err instanceof Error) {
                // fastify.log.error("Database connection failed:", err.message as any);
                fastify.log.error(err);
            }
            else {
                fastify.log.error("Database connection failed with unknown error.");
            }
            fastify.log.error("Database connection failed:", err);
        }
    });
};
exports.databaseConnect = databaseConnect;
