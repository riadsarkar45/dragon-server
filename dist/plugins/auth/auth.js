"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = void 0;
const Authenticate = async (req, reply) => {
    try {
        const token = req.cookies?.token;
        if (!token)
            return reply.status(401).send({ message: "No token added or found." });
        const decode = await req.server.jwt.verify(token);
        console.log(decode);
    }
    catch (e) {
        throw new Error(`${e} Jwt not verified`);
    }
};
exports.Authenticate = Authenticate;
