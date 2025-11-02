import { FastifyInstance } from "fastify";
import prisma from "../Prisma/prisma";

export const databaseConnect = (fastify: FastifyInstance) => {
    fastify.addHook("onReady", async () => {
        try {
            await prisma.$connect();
            fastify.log.info("Database connected successfully.");
        } catch (err) {
            if(err instanceof Error) {
                // fastify.log.error("Database connection failed:", err.message as any);
                fastify.log.error(err)
            }else {
                fastify.log.error("Database connection failed with unknown error.");
            }
            fastify.log.error("Database connection failed:", err as any);
        }
    })
}