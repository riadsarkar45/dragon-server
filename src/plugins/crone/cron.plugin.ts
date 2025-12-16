import { FastifyInstance } from "fastify";
import { sendExpiryEmails } from "../../jobs/sendEmail";

export const email = async (fastify: FastifyInstance) => {
    sendExpiryEmails();
    fastify.log.info('Cron jobs registered')
}