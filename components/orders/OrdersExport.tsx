"use client";

import React from "react";
import { FaPrint, FaFileCsv } from "react-icons/fa";
import { saveAs } from "file-saver";
import { Order } from "../../app/types";

interface OrdersExportProps {
  orders: Order[];
}

const OrdersExport: React.FC<OrdersExportProps> = ({ orders }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !printWindow.document) return; // Ensure it opens properly

    printWindow.document.write(`
      <html>
      <head>
        <title>Orders Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background-color: #222; color: white; }
        </style>
      </head>
      <body>
        <h2>Orders Report</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Shop</th>
              <th>Total (Ksh.)</th>
              <th>Payment Status</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            ${orders
              .map(
                (order) => `
              <tr>
                <td>${order.id}</td>
                <td>${order.customer?.name || "Unknown"}</td>
                <td>${order.shop?.name || "Unknown"}</td>
                <td>Ksh. ${order.total?.toFixed(2) || "0.00"}</td>
                <td>${order.paymentStatus || "N/A"}</td>
                <td>${order.status || "Unknown"}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      `"ID","Customer","Shop","Total","Payment Status","Order Status"\n` +
      orders
        .map(
          (order) =>
            `"${order.id}","${order.customer?.name || "Unknown"}","${order.shop?.name || "Unknown"}","Ksh. ${order.total?.toFixed(2) || "0.00"}","${order.paymentStatus || "N/A"}","${order.status || "Unknown"}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders_report.csv");
  };

  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        <FaPrint />
        Print
      </button>

      <button
        onClick={handleExportCSV}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
      >
        <FaFileCsv />
        Export CSV
      </button>
    </div>
  );
};

export default OrdersExport;
