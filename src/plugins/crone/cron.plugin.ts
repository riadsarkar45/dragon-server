import { FastifyInstance } from "fastify";
import { sendEmail } from "../../jobs/sendEmail";

export const email = async (fastify: FastifyInstance) => {
    sendEmail();
    fastify.log.info('Cron jobs registered')
}