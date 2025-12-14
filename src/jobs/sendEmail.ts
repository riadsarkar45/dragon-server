import cron from 'node-cron'
import prisma from '../Prisma/prisma'
export const sendEmail = () => {
  cron.schedule('*/5 * * * * *', async () => {

    const dyeingOrders = await prisma.dyeingOrders.findMany(
        {
            select: {
                orderedYarns: true,
                marketingName: true,
                colors: true,
                merchentName: true,
                factoryName: true,
                dyeingSection: true,
                orderNo: true,
                orderQty: true,
                monthName: true,
                challans: {
                    select: {
                        challanImage: true,
                        createdAt: true,
                    }
                },

                user: {
                    select: {
                        name: true,
                        userDesignation: true,
                        userRole: true,
                    }
                }
            },
            orderBy: {
                orderNo: 'asc',
            }
        }
    )

    console.log('Sending email with orders:', dyeingOrders)
    console.log('Running cron job')

  }, {
    timezone: 'Asia/Dhaka'
  })
}
