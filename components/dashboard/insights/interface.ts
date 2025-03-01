// interface.ts
export interface SalesData {
    day: string;
    totalSales: number;
    products: number;
    quantity: number;
    shop: string;
    time: string;
  }
  
  export interface OrderData {
    status: string;
    count: number;
    customerName: string;
    items: number;
  }
  
  export interface CustomerData {
    name: string;
    totalOrders: number;
    purchases: number;
    shopName: string;
  }
  
  export interface RevenueData {
    category: string;
    totalRevenue: number;
  }
  
  export interface Insights {
    sales: SalesData[];
    orders: OrderData[];
    customers: CustomerData[];
    revenue: RevenueData[];
  }