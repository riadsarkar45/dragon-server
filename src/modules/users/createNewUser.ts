import { FastifyReply, FastifyRequest } from "fastify";
import { usersBodyTypes } from "../../types/types";
import prisma from "../../Prisma/prisma";
import bcrypt from 'bcrypt';
export const createNewUser = async (req: FastifyRequest<{ Body: usersBodyTypes }>, reply: FastifyReply) => {
    const { userName, userDesignation, userRole, userEmail, userPassword } = req.body;

    if (!userName || !userDesignation || !userRole || !userEmail || !userPassword) {
        return reply.status(400).send({ message: "All fields are required" });
    }


    const findDuplicateEmailUser = await prisma.users.findUnique(
        {
            where: { email: userEmail }
        }
    )

    if (findDuplicateEmailUser) return reply.status(400).send({ message: `${findDuplicateEmailUser.email} already in use. Please try with different email address.` })

    const hashedPassword = await bcrypt.hash(userPassword, 15)


    const createNewUser = await prisma.users.create(
        {
            data: {
                name: userName,
                email: userEmail,
                userRole: userRole,
                userDesignation: userDesignation,
                profilePhotoUrl: 'photo url',
                password: hashedPassword
            }
        }
    )

    if (!createNewUser) return reply.status(400).send({ message: "User creation failed." })

    reply.status(200).send({ message: "User created Successfully" })

}