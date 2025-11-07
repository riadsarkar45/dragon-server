import prisma from "../../Prisma/prisma";
import { dyeingOrders } from "../../types/types";

export const orderRepository = {
    async createOrder(data: Omit<dyeingOrders, 'id' | 'createdAt'>) {
        if (!data) {
            throw new Error("No data provided to create new dyeing order");
        }

        try {
            const order = await prisma.dyeingOrders.create({
                data
            });
            return order;
        } catch (error) {
            console.error("Error creating dyeing order:", error);
            throw new Error("Failed to create dyeing order");
        }
    },

    async findOrderByMonth(monthName: string) {
        if (!monthName) {
            throw new Error("No month name provided for filtering");
        }

        try {
            // Assuming monthName is like "January", "February", etc.
            // You might need to adjust this logic based on your data structure
            const orders = await prisma.dyeingOrders.findMany({
                where: {
                    createdAt: {
                        gte: new Date(`${monthName} 1, ${new Date().getFullYear()}`),
                        lt: new Date(`${monthName} 32, ${new Date().getFullYear()}`)
                    }
                }
            });
            
            return orders; // Return empty array if no results (more RESTful)
        } catch (error) {
            console.error("Error filtering orders by month:", error);
            throw new Error("Failed to filter orders by month");
        }
    },

    // Additional useful methods
    async findById(id: number) {
        try {
            const order = await prisma.dyeingOrders.findUnique({
                where: { id }
            });
            return order;
        } catch (error) {
            console.error("Error finding order by ID:", error);
            throw new Error("Failed to find order by ID");
        }
    },

    async findAll(limit?: number, offset?: number) {
        try {
            const orders = await prisma.dyeingOrders.findMany({
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' }
            });
            return orders;
        } catch (error) {
            console.error("Error fetching all orders:", error);
            throw new Error("Failed to fetch orders");
        }
    }
};