import { FastifyReply, FastifyRequest } from "fastify";
import { usersBodyTypes } from "../../types/types";

export const createNewUser = (req: FastifyRequest<{ Body: usersBodyTypes }>, reply: FastifyReply) => {
    const { userName, userDesignation, userRole, userEmail, userPassword } = req.body;
}