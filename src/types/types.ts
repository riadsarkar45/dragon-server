
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
