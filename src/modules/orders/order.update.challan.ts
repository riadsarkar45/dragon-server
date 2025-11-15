import { FastifyReply, FastifyRequest } from "fastify";

interface Body {
    challanImages: string[];
}

export const updateDyeingOrderWithChallan = async (req: FastifyRequest<{ Body: Body }>, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { challanImages } = req.body;
    console.log(challanImages, "images");
    console.log(id, 'id');
}