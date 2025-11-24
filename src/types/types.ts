
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
    unitPrice: number
}

export interface sampleAdjustParams {
    yarnId: number
}

export interface usersBodyTypes {
    userName: string;
    userDesignation: string;
    userRole: string;
    profilePhotoUrl: string;
    userEmail: string;
    userPassword: string
}

export interface loginUserPayload {
    email: string;
    password: string
}

export interface yarnStockPayload {
    yarnType: string;
    supplierName: string;
    receivedQty: string;
    challanNo: string;
}

export interface piGeneratorPayload {
    buyerName: string
    date: string
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
    }[];
    hsCode: string;
    grandTotal: number;
    piNo: string
}
