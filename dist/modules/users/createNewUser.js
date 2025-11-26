"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUser = void 0;
const prisma_1 = __importDefault(require("../../Prisma/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createNewUser = async (req, reply) => {
    const { userName, userDesignation, userRole, userEmail, userPassword } = req.body;
    if (!userName || !userDesignation || !userRole || !userEmail || !userPassword) {
        return reply.status(400).send({ message: "All fields are required" });
    }
    const findDuplicateEmailUser = await prisma_1.default.users.findUnique({
        where: { email: userEmail }
    });
    if (findDuplicateEmailUser)
        return reply.status(400).send({ message: `${findDuplicateEmailUser.email} already in use. Please try with different email address.` });
    const hashedPassword = await bcrypt_1.default.hash(userPassword, 15);
    const createNewUser = await prisma_1.default.users.create({
        data: {
            name: userName,
            email: userEmail,
            userRole: userRole,
            userDesignation: userDesignation,
            profilePhotoUrl: 'photo url',
            password: hashedPassword
        }
    });
    if (!createNewUser)
        return reply.status(400).send({ message: "User creation failed." });
    reply.status(200).send({ message: "User created Successfully" });
};
exports.createNewUser = createNewUser;
