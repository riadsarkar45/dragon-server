import { FastifyReply, FastifyRequest } from "fastify";

export const Authenticate = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const token = req.cookies?.token;

        if (!token) return reply.status(401).send({ message: "No token added or found." });

        const decode = await req.server.jwt.verify(token)

        console.log(decode);
    } catch (e) {
        throw new Error(`${e} Jwt not verified`)
    }


}