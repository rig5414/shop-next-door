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
    customer: { id: string; name: string; email: string };
    shop: { id: string; name: string };
    total: number;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    items: OrderItem[];
    isRefunded?: boolean;
  };
  