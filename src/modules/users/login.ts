import { FastifyReply, FastifyRequest } from "fastify";
import { loginUserPayload } from "../../types/types";
import prisma from "../../Prisma/prisma";
import bcrypt from "bcrypt";
export const userLogin = async (req: FastifyRequest<{ Body: loginUserPayload }>, reply: FastifyReply) => {

    const { email, password } = req.body;

    if (!email || !password) return reply.status(400).send({ message: "Required fields are missing." });

    const findUserIfExists = await prisma.users.findUnique(
        {
            where: { email: email }
        }
    )


    if (findUserIfExists?.email || findUserIfExists?.password) {

        const isPasswordValid = await bcrypt.compare(password, findUserIfExists?.password);

        if (isPasswordValid) {
            const token = req.server.jwt.sign(
                {
                    email: findUserIfExists.email,
                    userName: findUserIfExists.name,
                    userRole: findUserIfExists.userRole,
                    userDesignation: findUserIfExists.userDesignation,
                }
            )

            reply
                .setCookie('token', token,
                    {
                        httpOnly: true,
                        secure: false, // turn to true before deploy to production
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 60 * 60 * 24 // 1 day in seconds
                    }
                )
                .status(200).send({ message: "Login Successful" })
        } else {
            reply.status(400).send({ message: "Invalid Password or Email." })
        }

    }

}