// interface.ts
export interface SalesData {
  date: string;
  total: number;
  completed: number;
  completionRate: number;
}

export interface OrderData {
  status: string;
  count: number;
}

export interface CustomerData {
  customer: string;
  ordersPlaced: number;
}

export interface RevenueData {
  createdAt: string;
  _sum: {
    total: number;
  };
  month: string;
}

export interface Insights {
  sales: SalesData[];
  orders: OrderData[];
  customers: CustomerData[];
  revenue: RevenueData[];
}