import cron from 'node-cron'
import prisma from '../Prisma/prisma'
import nodemailer from 'nodemailer'
import { startOfDay, addDays } from 'date-fns'

// Configure transporter for Gmail app password
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'sarkarriad92@gmail.com', // use .env for production
    pass: "ufsx yqbr tnrr nxtl",
  },
})

const sendEmail = async (orderNumbers: string[]) => {
  if (orderNumbers.length === 0) return

  const sendWarningEmail = await transporter.sendMail({
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
        .map(
          (o) =>
            `<tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${o}</td>
                </tr>`
        )
        .join('')}
        </tbody>
      </table>

      <p style="margin-top: 20px; font-size: 0.9em; color: #777;">
        This is an automated notification. Please take necessary action.
      </p>
    </body>
  </html>
  `,
  })

  if (sendWarningEmail.rejected.length > 0) {
    console.error('❌ Email send failed for orders:', orderNumbers.join(', '))
    return
  }

  const updateMailTableForHistory = await prisma.countSentEmails.createMany(
    {
      data: orderNumbers.map((orderNo) => ({
        orderNo: orderNo,
        emailType: 'Expiry Warning',
        email: "SENT"
      })),
    }
  )

  if (updateMailTableForHistory) {
    console.log(' Email history logged successfully.')
  }



  console.log(`📧 Expiry warning email sent for orders: ${orderNumbers.join(', ')}`)
}

export const sendExpiryEmails = () => {
  cron.schedule('0 10 * * *', async () => {
    try {
      const today = startOfDay(new Date())
      const tomorrowStart = addDays(today, 1)
      const tomorrowEnd = addDays(tomorrowStart, 1)

      const ordersExpiringTomorrow = await prisma.dyeingOrders.findMany({
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
      })

      if (ordersExpiringTomorrow.length === 0) {
        console.log('📭 No orders expiring tomorrow.')
        return
      }

      const orderNumbers = ordersExpiringTomorrow.map(o => o.orderNo)
      await sendEmail(orderNumbers)
    } catch (err) {
      console.error('❌ Cron error:', err)
    }
  }, { timezone: 'Asia/Dhaka' })
}
