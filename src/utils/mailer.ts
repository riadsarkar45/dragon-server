import nodemailer from 'nodemailer'
import { env } from 'process'

export const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.WARNING_EMAIL_FROM,
    pass: env.APP_PASSWORD,
  },
})
