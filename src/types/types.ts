export interface dyeingOrder {
    orderNo: string;
    orderQty: string;
    yarnType: string;
    marketingName: string
    marketingId: number
    monthName: string
}

// model dyeingOrders {
//   id            Int                  @id @default(autoincrement())
//   orderNo       String
//   orderQty      String
//   yarnType      String
//   createdAt     DateTime             @default(now())
//   marketingName users @relation(fields: [id], references: [id])
// }