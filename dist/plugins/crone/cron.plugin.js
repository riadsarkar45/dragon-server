"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.email = void 0;
const sendEmail_1 = require("../../jobs/sendEmail");
const email = async (fastify) => {
    (0, sendEmail_1.sendExpiryEmails)();
    fastify.log.info('Cron jobs registered');
};
exports.email = email;
