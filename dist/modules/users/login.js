"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = void 0;
const prisma_1 = __importDefault(require("../../Prisma/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userLogin = async (req, reply) => {
    const { email, password } = req.body;
    if (!email || !password)
        return reply.status(400).send({ message: "Required fields are missing." });
    const findUserIfExists = await prisma_1.default.users.findUnique({
        where: { email: email }
    });
    if (findUserIfExists?.email || findUserIfExists?.password) {
        const isPasswordValid = await bcrypt_1.default.compare(password, findUserIfExists?.password);
        if (isPasswordValid) {
            const token = req.server.jwt.sign({
                email: findUserIfExists.email,
                userName: findUserIfExists.name,
                userRole: findUserIfExists.userRole,
                userDesignation: findUserIfExists.userDesignation,
            });
            reply
                .setCookie('token', token, {
                httpOnly: true,
                secure: false, // turn to true before deploy to production
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day in seconds
            })
                .status(200).send({ message: "Login Successful" });
        }
        else {
            reply.status(400).send({ message: "Invalid Password or Email." });
        }
    }
};
exports.userLogin = userLogin;
