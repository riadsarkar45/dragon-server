// export interface dyeingOrder {
//     orderNo: string;
//     orderQty: string;
//     yarnType: string;
//     marketingName: string
//     marketingId: number
//     monthName: string
// }

export interface dyeingOrder {
    colors: string;
    orderNo: string;
    marketingId: number;
    dyeingSection: string;
    factoryName: string;
    marketingName: string;
    merchentName: string;
    orderQty: string;
    yarnType: string;
    monthName: string;  // Add this
    createdAt: Date;
    id?: string;        // Optional for creation
}




// model dyeingOrders {
//   id            Int                  @id @default(autoincrement())
//   orderNo       String
//   orderQty      String
//   yarnType      String
//   createdAt     DateTime             @default(now())
//   marketingName users @relation(fields: [id], references: [id])
// }