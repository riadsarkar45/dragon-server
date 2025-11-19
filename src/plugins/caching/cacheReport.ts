import { FastifyReply, FastifyRequest } from "fastify";

export const cacheReport = (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const stats = req.server.cache.getStats();
        reply.status(200).send({
            keys: stats.keys,
            hitRate: stats.hits / (stats.hits + stats.misses || 1) * 100,
            memoryUsage: process.memoryUsage().heapUsed
        })
    } catch (e) {
        console.log(e)
        reply.status(500).send({ message: "Internal Server error" })
    }

}