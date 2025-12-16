"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendExpiryEmails = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../Prisma/prisma"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const date_fns_1 = require("date-fns");
// Configure transporter for Gmail app password
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sarkarriad92@gmail.com', // use .env for production
        pass: "ufsx yqbr tnrr nxtl",
    },
});
const sendEmail = async (orderNumbers) => {
    if (orderNumbers.length === 0)
        return;
    await transporter.sendMail({
        from: '"Riad"',
        to: 'sarkarriad92@gmail.com',
        subject: 'Expiry Warning: Orders Expiring Tomorrow',
        text: `The following orders are expiring tomorrow: ${orderNumbers.join(', ')}`,
        html: `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <div style="background-color: #f44336; color: white; padding: 15px; text-align: center;">
        <h2>⚠️ Expiry Warning: Orders Expiring Tomorrow</h2>
      </div>

      <p>The following orders are expiring tomorrow:</p>

      <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Order No</th>
          </tr>
        </thead>
        <tbody>
          ${orderNumbers
            .map((o) => `<tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${o}</td>
                </tr>`)
            .join('')}
        </tbody>
      </table>

      <p style="margin-top: 20px; font-size: 0.9em; color: #777;">
        This is an automated notification. Please take necessary action.
      </p>
    </body>
  </html>
  `,
    });
    console.log(`📧 Expiry warning email sent for orders: ${orderNumbers.join(', ')}`);
};
const sendExpiryEmails = () => {
    node_cron_1.default.schedule('0 9 * * *', async () => {
        try {
            const today = (0, date_fns_1.startOfDay)(new Date());
            const tomorrowStart = (0, date_fns_1.addDays)(today, 1);
            const tomorrowEnd = (0, date_fns_1.addDays)(tomorrowStart, 1);
            const ordersExpiringTomorrow = await prisma_1.default.dyeingOrders.findMany({
                where: {
                    expireDate: {
                        gte: tomorrowStart,
                        lt: tomorrowEnd,
                    },
                },
                select: {
                    orderNo: true,
                },
                orderBy: { orderNo: 'asc' },
            });
            if (ordersExpiringTomorrow.length === 0) {
                console.log('📭 No orders expiring tomorrow.');
                return;
            }
            const orderNumbers = ordersExpiringTomorrow.map(o => o.orderNo);
            await sendEmail(orderNumbers);
        }
        catch (err) {
            console.error('❌ Cron error:', err);
        }
    }, { timezone: 'Asia/Dhaka' });
};
exports.sendExpiryEmails = sendExpiryEmails;
