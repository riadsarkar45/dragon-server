import { error } from "console"
import prisma from "../../Prisma/prisma"
import { dyeingOrder } from "../../types/types"

export const orderRepository = {
    async createOrder(data: dyeingOrder) {

        if (!data) {
            throw new Error("No data provided to create new dyeing order check line 7 file orders.repository.ts")
        }

        const createDyeingOrder = await prisma.dyeingOrders.create({

            data
        })

        if (!createDyeingOrder) {
            throw new Error("New dyeing order creation failed line 14 file orders.repository.ts")
        }

        return createDyeingOrder;
    },

    async findOrderByMonth(monthName: string) {

        if (!monthName) throw new Error("No month name provided to filter according to month name -> Error line no 17 function finderOrderByMonth");

        const filter = await prisma.dyeingOrders.findMany(
            {
                where: { monthName: monthName }
            }
        )

        if (!filter) {
            throw new Error("No filtered data found")
        }

        return filter;

    }

}