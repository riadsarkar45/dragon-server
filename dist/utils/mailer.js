"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const process_1 = require("process");
exports.mailer = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process_1.env.WARNING_EMAIL_FROM,
        pass: process_1.env.APP_PASSWORD,
    },
});
