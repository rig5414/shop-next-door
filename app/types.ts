export type OrderStatus = "Pending" | "Completed" | "Processing" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Failed";

export type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  };
  
  export type Order = {
    id: string;
    customer: string;
    shop: string;
    total: number;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
  };
  